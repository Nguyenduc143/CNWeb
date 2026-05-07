import sql from 'mssql';
import bcrypt from 'bcryptjs';
import { getConnection } from '../config/db';
import { emailService } from './emailService';

// Sinh OTP ngẫu nhiên 6 chữ số
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authService = {
  login: async (loginId: string, passwordRaw: string) => {
    const pool = await getConnection();
    
    // Gọi Stored Procedure Đăng nhập gốc
    const userResult = await pool.request()
        .input('Email', sql.NVarChar, loginId)
        .execute('sp_LoginUser');

    if (userResult.recordset.length === 0) {
      return null; // Không tìm thấy
    }

    const user = userResult.recordset[0];

    if (user.IsLocked) {
      throw new Error('Tài khoản đã bị khóa từ hệ thống');
    }

    const isMatch = await bcrypt.compare(passwordRaw, user.PasswordHash);
    if (!isMatch) {
      return null; // Sai mật khẩu
    }

    if (user.DaXacThucEmail === false) {
      throw new Error('NOT_VERIFIED');
    }

    return {
      Id: user.UserId,
      Username: user.Email,
      FullName: user.FullName,
      PhoneNumber: user.PhoneNumber,
      Role: user.Role || 'Customer' // Tạm thời hardcode, sau này join bảng UserRoles
    };
  },

  register: async (email: string, phone: string, fullName: string, passwordRaw: string) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordRaw, salt);

    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    const pool = await getConnection();
    const result = await pool.request()
        .input('Email', sql.NVarChar, email)
        .input('PhoneNumber', sql.NVarChar, phone)
        .input('FullName', sql.NVarChar, fullName)
        .input('PasswordHash', sql.NVarChar, passwordHash)
        .input('MaOTP', sql.NVarChar, otpCode)
        .input('ThoiGianHetHanOTP', sql.DateTime2, otpExpiry)
        .execute('sp_RegisterUser');

    const newUser = result.recordset[0];
    if (newUser.ErrorCode === 'EMAIL_EXISTS') {
      throw new Error('EMAIL_EXISTS');
    }

    // Gửi email không đợi (hoặc có thể đợi tùy ý, ở đây đợi để báo lỗi nếu gửi lỗi)
    await emailService.sendOTP(email, otpCode);

    return {
      Email: newUser.Email
    };
  },

  verifyOTP: async (email: string, otpCode: string) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .input('MaOTP', sql.NVarChar, otpCode)
      .execute('sp_VerifyOTP');

    const status = result.recordset[0].ErrorCode;
    if (status !== 'SUCCESS') {
      throw new Error(status);
    }
    return true;
  },

  getProfile: async (userId: string) => {
    const pool = await getConnection();
    const userResult = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .execute('sp_GetUserProfile');
      
    if (userResult.recordset.length === 0) return null;
    return userResult.recordset[0];
  },

  updateProfile: async (userId: string, fullName: string, phone: string) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('FullName', sql.NVarChar, fullName)
      .input('PhoneNumber', sql.NVarChar, phone)
      .execute('sp_UpdateUserProfile');

    if (result.recordset.length === 0) return null;
    return result.recordset[0];
  },

  forgotPasswordSendOTP: async (email: string) => {
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    const pool = await getConnection();
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .input('MaOTP', sql.NVarChar, otpCode)
      .input('ThoiGianHetHan', sql.DateTime2, otpExpiry)
      .execute('sp_UpdateOTP');

    const status = result.recordset[0].ErrorCode;
    if (status === 'USER_NOT_FOUND') {
      throw new Error('Không tìm thấy tài khoản với email này.');
    }

    await emailService.sendOTP(email, otpCode, 'reset_password');
    return true;
  },

  resetPasswordWithOTP: async (email: string, otpCode: string, newPasswordRaw: string) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPasswordRaw, salt);

    const pool = await getConnection();
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .input('MaOTP', sql.NVarChar, otpCode)
      .input('NewPasswordHash', sql.NVarChar, passwordHash)
      .execute('sp_ResetPasswordWithOTP');

    const status = result.recordset[0].ErrorCode;
    if (status === 'USER_NOT_FOUND') throw new Error('USER_NOT_FOUND');
    if (status === 'INVALID_OR_EXPIRED_OTP') throw new Error('INVALID_OR_EXPIRED_OTP');

    return true;
  },


  changePassword: async (userId: string, oldPasswordRaw: string, newPasswordRaw: string, otpCode: string) => {
    const pool = await getConnection();
    
    const userResult = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .execute('sp_GetUserPassword');

    if (userResult.recordset.length === 0) {
      throw new Error('USER_NOT_FOUND');
    }

    const currentHash = userResult.recordset[0].PasswordHash;
    const isMatch = await bcrypt.compare(oldPasswordRaw, currentHash);
    
    if (!isMatch) {
      throw new Error('WRONG_PASSWORD');
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPasswordRaw, salt);

    const updateResult = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('NewPasswordHash', sql.NVarChar, newPasswordHash)
      .input('MaOTP', sql.NVarChar, otpCode)
      .execute('sp_ChangePasswordWithOTP');

    const status = updateResult.recordset[0].ErrorCode;
    if (status === 'INVALID_OR_EXPIRED_OTP') {
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }
    return true;
  },

  //login with google
  loginWithGoogle: async (email: string, googleId: string, fullName: string, avatarUrl: string) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .input('GoogleId', sql.NVarChar, googleId)
      .input('FullName', sql.NVarChar, fullName)
      .input('AvatarUrl', sql.NVarChar, avatarUrl)
      .execute('sp_LoginWithGoogle');

    if (result.recordset.length === 0) {
      throw new Error('Không thể đăng nhập bằng Google');
    }

    const user = result.recordset[0];
    if (user.IsLocked) {
      throw new Error('Tài khoản đã bị khóa từ hệ thống');
    }

    return {
      Id: user.UserId,
      Username: user.Username, // returned as Email aliased to Username
      FullName: user.FullName,
      Role: user.Role,
      Avatar: user.Avatar
    };
  }
};
