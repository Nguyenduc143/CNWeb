import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { success, error } from '../utils/response';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/authMiddleware';

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
    return error(res, err.message || 'Login failed', 500);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName || !phone) {
      return error(res, 'Thiếu thông tin đăng ký', 400);
    }

    const user = await authService.register(email, phone, fullName, password);

    const token = generateToken({
      id: user.Id,
      username: user.Username,
      role: user.Role
    });

    return success(res, {
      user: {
        id: user.Id,
        username: user.Username,
        fullName: user.FullName,
        role: user.Role
      },
      token
    }, 'Register successful');

  } catch (err: any) {
    console.error('Register error:', err);
    if (err.message === 'EMAIL_EXISTS') {
      return error(res, 'Email already in use', 400);
    }
    return error(res, 'Registration failed', 500);
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
    const { email, phone, newPassword } = req.body;

    if (!email || !phone || !newPassword) {
      return error(res, 'Vui lòng nhập đầy đủ Email, Số điện thoại và Mật khẩu mới', 400);
    }

    if (newPassword.length < 6) {
      return error(res, 'Mật khẩu mới phải có ít nhất 6 ký tự', 400);
    }

    await authService.resetPassword(email, phone, newPassword);
    
    return success(res, null, 'Đặt lại mật khẩu thành công');
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return error(res, err.message || 'Lỗi đặt lại mật khẩu', 400);
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return error(res, 'Vui lòng đăng nhập', 401);
    }
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return error(res, 'Vui lòng điền đủ mật khẩu cũ và mới', 400);
    }
    if (newPassword.length < 6) {
      return error(res, 'Mật khẩu mới phải tối thiểu 6 ký tự', 400);
    }

    await authService.changePassword(req.user.id, oldPassword, newPassword);
    
    return success(res, null, 'Đổi mật khẩu thành công');
  } catch (err: any) {
    console.error('Change password error:', err);
    if (err.message === 'INCORRECT_OLD_PASSWORD') {
      return error(res, 'Mật khẩu cũ không chính xác', 400);
    }
    return error(res, 'Không thể đổi mật khẩu, vui lòng thử lại', 500);
  }
};
