import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { success, error } from '../utils/response';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/authMiddleware';
// Google OAuth
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Dùng biến email/username tùy giao diện FE
    const loginId = email || req.body.username;

    if (!loginId || !password) {
      return error(res, 'Username/Email and password are required', 400);
    }

    // Tách hẳn logic tìm trong SQL sang AuthService
    const user = await authService.login(loginId, password);

    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    // Generate JWT token
    const token = generateToken({
      id: user.Id,
      username: user.Username,
      role: user.Role
    });

    // Return user data with token
    return success(res, {
      user: {
        id: user.Id,
        username: user.Username,
        fullName: user.FullName,
        role: user.Role
      },
      token
    }, 'Login successful');

  } catch (err: any) {
    console.error('Login error:', err);
    if (err.message === 'NOT_VERIFIED') {
      return error(res, 'Tài khoản chưa xác thực Email. Vui lòng xác thực trước khi đăng nhập.', 403);
    }
    return error(res, err.message || 'Login failed', 500);
  }
};


export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName || !phone) {
      return error(res, 'Thiếu thông tin đăng ký', 400);
    }

    const result = await authService.register(email, phone, fullName, password);

    return success(res, { email: result.Email }, 'Đăng ký thành công, vui lòng kiểm tra email để nhận mã OTP.');

  } catch (err: any) {
    console.error('Register error:', err);
    if (err.message === 'EMAIL_EXISTS') {
      return error(res, 'Email already in use', 400);
    }
    return error(res, 'Registration failed', 500);
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
      return error(res, 'Thiếu Email hoặc mã OTP', 400);
    }

    await authService.verifyOTP(email, otpCode);
    return success(res, null, 'Xác thực tài khoản thành công! Bạn có thể đăng nhập.');
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    if (err.message === 'ALREADY_VERIFIED') return error(res, 'Tài khoản đã được xác thực trước đó.', 400);
    if (err.message === 'INVALID_OR_EXPIRED_OTP') return error(res, 'Mã OTP không chính xác hoặc đã hết hạn.', 400);
    if (err.message === 'USER_NOT_FOUND') return error(res, 'Không tìm thấy người dùng.', 404);
    return error(res, 'Xác thực thất bại', 500);
  }
};


export const me = async (req: AuthRequest, res: Response) => {
  try {
    // User info is attached by authMiddleware
    if (!req.user) {
      return error(res, 'User not authenticated', 401);
    }

    // Truy vấn thêm dữ liệu tươi nếu cần
    const profile = await authService.getProfile(req.user.id);
    
    return success(res, {
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        fullName: profile?.FullName,
        phone: profile?.PhoneNumber
      }
    });
  } catch (err) {
    console.error('Me error:', err);
    return error(res, 'Failed to get user info', 500);
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return error(res, 'User not authenticated', 401);
    }
    const { fullName, phone } = req.body;
    const updatedProfile = await authService.updateProfile(req.user.id, fullName, phone);

    if (!updatedProfile) {
      return error(res, 'User not found to update', 404);
    }

    return success(res, {
      user: {
        id: updatedProfile.UserId,
        username: updatedProfile.Email,
        fullName: updatedProfile.FullName,
        phone: updatedProfile.PhoneNumber,
        role: req.user.role
      }
    }, 'Cập nhật thông tin thành công');
  } catch (err) {
    console.error('Update Me error:', err);
    return error(res, 'Cập nhật thất bại', 500);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return error(res, 'Vui lòng nhập Email', 400);
    }

    await authService.forgotPasswordSendOTP(email);
    return success(res, null, 'Mã xác thực đã được gửi đến email của bạn');
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return error(res, err.message || 'Lỗi gửi mã xác thực', 400);
  }
};

export const resetPasswordWithOTP = async (req: Request, res: Response) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return error(res, 'Vui lòng nhập đầy đủ thông tin', 400);
    }

    if (newPassword.length < 6) {
      return error(res, 'Mật khẩu mới phải có ít nhất 6 ký tự', 400);
    }

    await authService.resetPasswordWithOTP(email, otpCode, newPassword);
    return success(res, null, 'Đặt lại mật khẩu thành công');
  } catch (err: any) {
    console.error('Reset password error:', err);
    if (err.message === 'USER_NOT_FOUND') return error(res, 'Không tìm thấy tài khoản', 404);
    if (err.message === 'INVALID_OR_EXPIRED_OTP') return error(res, 'Mã xác thực không hợp lệ hoặc đã hết hạn', 400);
    return error(res, 'Lỗi đặt lại mật khẩu', 500);
  }
};


export const sendChangePasswordOTP = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return error(res, 'Vui lòng đăng nhập', 401);
    
    const userProfile = await authService.getProfile(req.user.id);
    if (!userProfile) return error(res, 'Không tìm thấy người dùng', 404);

    await authService.forgotPasswordSendOTP(userProfile.Email);
    return success(res, null, 'Mã xác thực đã được gửi đến email của bạn');
  } catch (err: any) {
    console.error('Send change password OTP error:', err);
    return error(res, 'Lỗi gửi mã xác thực', 500);
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return error(res, 'Vui lòng đăng nhập', 401);
    }
    const { oldPassword, newPassword, otpCode } = req.body;
    
    if (!oldPassword || !newPassword || !otpCode) {
      return error(res, 'Vui lòng điền đủ mật khẩu cũ, mật khẩu mới và mã OTP', 400);
    }
    if (newPassword.length < 6) {
      return error(res, 'Mật khẩu mới phải tối thiểu 6 ký tự', 400);
    }

    await authService.changePassword(req.user.id, oldPassword, newPassword, otpCode);
    
    return success(res, null, 'Đổi mật khẩu thành công');
  } catch (err: any) {
    console.error('Change password error:', err);
    if (err.message === 'WRONG_PASSWORD') {
      return error(res, 'Mật khẩu cũ không chính xác', 400);
    }
    if (err.message === 'INVALID_OR_EXPIRED_OTP') {
      return error(res, 'Mã xác thực không hợp lệ hoặc đã hết hạn', 400);
    }
    return error(res, 'Không thể đổi mật khẩu, vui lòng thử lại', 500);
  }
};
//login with google
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return error(res, 'Google token is required', 400);
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return error(res, 'Invalid Google token', 401);
    }

    const { email, sub: googleId, name, picture } = payload;
    
    if (!email) {
       return error(res, 'Google account missing email', 400);
    }

    const user = await authService.loginWithGoogle(email, googleId, name || '', picture || '');

    const jwtToken = generateToken({
      id: user.Id,
      username: user.Username,
      role: user.Role
    });

    return success(res, {
      user: {
        id: user.Id,
        username: user.Username,
        fullName: user.FullName,
        role: user.Role,
        avatar: user.Avatar
      },
      token: jwtToken
    }, 'Đăng nhập Google thành công');

  } catch (err: any) {
    console.error('Google login error:', err);
    return error(res, 'Đăng nhập Google thất bại', 500);
  }
};
