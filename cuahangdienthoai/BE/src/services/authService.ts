import sql from 'mssql';
import bcrypt from 'bcryptjs';
import { getConnection } from '../config/db';

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

    const pool = await getConnection();
    const result = await pool.request()
        .input('Email', sql.NVarChar, email)
        .input('PhoneNumber', sql.NVarChar, phone)
        .input('FullName', sql.NVarChar, fullName)
        .input('PasswordHash', sql.NVarChar, passwordHash)
        .execute('sp_RegisterUser');

    const newUser = result.recordset[0];
    if (newUser.ErrorCode === 'EMAIL_EXISTS') {
      throw new Error('EMAIL_EXISTS');
    }

    return {
      Id: newUser.UserId,
      Username: newUser.Email,
      FullName: newUser.FullName,
      Role: 'Customer'
    };
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

  resetPassword: async (email: string, phone: string, newPasswordRaw: string) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPasswordRaw, salt);

    const pool = await getConnection();
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .input('PhoneNumber', sql.NVarChar, phone)
      .input('NewPasswordHash', sql.NVarChar, passwordHash)
      .execute('sp_ResetPassword');

    const status = result.recordset[0];
    if (status.Success === 0) {
      throw new Error(status.Message);
    }
    return status;
  },

  changePassword: async (userId: string, oldPasswordRaw: string, newPasswordRaw: string) => {
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
      throw new Error('INCORRECT_OLD_PASSWORD');
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPasswordRaw, salt);

    await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('NewPasswordHash', sql.NVarChar, newHash)
      .execute('sp_UpdatePasswordByUserId');

    return true;
  }
};
