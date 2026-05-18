

import sql from 'mssql';
import bcrypt from 'bcryptjs';                 // Hash mật khẩu (one-way)
import { getConnection } from '../config/db';
import { emailService } from './emailService';


// HÀM PHỤ: Sinh mã OTP 6 chữ số ngẫu nhiên (100000 -> 999999)

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authService = {
 
  // ĐĂNG NHẬP: Kiểm tra email + password trong DB
 
  login: async (loginId: string, passwordRaw: string) => {
    const pool = await getConnection();

    // SP sp_LoginUser: tìm user theo email/phone, trả về thông tin + password hash
    const userResult = await pool.request()
        .input('Email', sql.NVarChar, loginId)
        .execute('sp_LoginUser');

    if (userResult.recordset.length === 0) {
      return null;  // Không tìm thấy user
    }

    const user = userResult.recordset[0];

    // Kiểm tra tài khoản có bị admin khoá không
    if (user.IsLocked) {
      throw new Error('Tài khoản đã bị khóa từ hệ thống');
    }

    // So sánh mật khẩu raw với hash đã lưu trong DB
    // bcrypt.compare tự xử lý salt (đã nhúng trong hash)
    const isMatch = await bcrypt.compare(passwordRaw, user.PasswordHash);
    if (!isMatch) {
      return null;  // Sai mật khẩu
    }

    // Chưa xác thực email qua OTP -> không cho login
    if (user.DaXacThucEmail === false) {
      throw new Error('NOT_VERIFIED');
    }

    return {
      Id: user.UserId,
      Username: user.Email,
      FullName: user.FullName,
      PhoneNumber: user.PhoneNumber,
      Role: user.Role || 'Customer'
    };
  },

 
  // ĐĂNG KÝ TÀI KHOẢN MỚI
 

  register: async (email: string, phone: string, fullName: string, passwordRaw: string) => {
    // Bước 1: hash với salt 10 vòng (cân bằng giữa bảo mật và hiệu năng)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordRaw, salt);

    // Bước 2: tạo OTP và đặt thời gian hết hạn 5 phút
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // Bước 3: gọi SP đăng ký
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
    // SP trả ErrorCode để báo lỗi nghiệp vụ (email đã tồn tại)
    if (newUser.ErrorCode === 'EMAIL_EXISTS') {
      throw new Error('EMAIL_EXISTS');
    }

    // Bước 4: gửi email OTP (await -> nếu lỗi sẽ throw ngược cho controller)
    await emailService.sendOTP(email, otpCode);

    return {
      Email: newUser.Email
    };
  },

 
  // XÁC THỰC OTP SAU KHI ĐĂNG KÝ
  
  // SP kiểm tra: OTP có đúng + chưa hết hạn + tài khoản tồn tại
 
  verifyOTP: async (email: string, otpCode: string) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .input('MaOTP', sql.NVarChar, otpCode)
      .execute('sp_VerifyOTP');

    // SP trả ErrorCode dạng string: 'SUCCESS' | 'INVALID_OR_EXPIRED_OTP' | 'USER_NOT_FOUND' | 'ALREADY_VERIFIED'
    const status = result.recordset[0].ErrorCode;
    if (status !== 'SUCCESS') {
      throw new Error(status);
    }
    return true;
  },

  
  // LẤY THÔNG TIN PROFILE USER
  
  getProfile: async (userId: string) => {
    const pool = await getConnection();
    const userResult = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .execute('sp_GetUserProfile');

    if (userResult.recordset.length === 0) return null;
    return userResult.recordset[0];
  },

  
  // CẬP NHẬT PROFILE (chỉ fullName + phone)
  
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

  
  // QUÊN MẬT KHẨU - GỬI OTP
 
  // Sinh OTP mới cho email và lưu vào DB, sau đó gửi mail
  
  forgotPasswordSendOTP: async (email: string) => {
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);  // 5 phút

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

    // Truyền type 'reset_password' để email có nội dung phù hợp
    await emailService.sendOTP(email, otpCode, 'reset_password');
    return true;
  },

  
  // ĐẶT LẠI MẬT KHẨU SAU KHI NHẬN OTP
  
  resetPasswordWithOTP: async (email: string, otpCode: string, newPasswordRaw: string) => {
    // Hash mật khẩu mới trước khi gửi xuống DB
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

  
  // ĐỔI MẬT KHẨU (KHI ĐÃ ĐĂNG NHẬP) - 3 lớp xác thực
  
  // Lớp 1: User phải có token hợp lệ (do middleware kiểm tra)
  // Lớp 2: Phải biết mật khẩu cũ
  // Lớp 3: Phải có OTP đã gửi qua email
  
  changePassword: async (userId: string, oldPasswordRaw: string, newPasswordRaw: string, otpCode: string) => {
    const pool = await getConnection();

    // Bước 1: Lấy hash hiện tại để so sánh với oldPassword
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

    // Bước 2: Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPasswordRaw, salt);

    // Bước 3: Gọi SP đổi MK (SP sẽ kiểm tra OTP có đúng + còn hiệu lực)
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

  
  // ĐĂNG NHẬP BẰNG GOOGLE
  
  // SP sẽ:
  //   - Nếu email đã tồn tại trong DB -> link với googleId, cho login
  //   - Nếu chưa có -> tạo user mới (auto-verified, không cần OTP)
 
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
      Username: user.Username,
      FullName: user.FullName,
      Role: user.Role,
      Avatar: user.Avatar
    };
  }
};
