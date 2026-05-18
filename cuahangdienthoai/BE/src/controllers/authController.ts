

import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { success, error } from '../utils/response';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/authMiddleware';
import { OAuth2Client } from 'google-auth-library';

// Client của Google dùng để verify ID token gửi lên từ FE (sau khi user bấm Google Sign-In)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// LOGIN: POST /api/auth/login
// Body: { email, password } hoặc { username, password }
// Trả về: { user, token } nếu đúng; lỗi 401 nếu sai thông tin

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Hỗ trợ cả 2 tên trường: email hoặc username (linh hoạt với UI khác nhau)
    const loginId = email || req.body.username;

    // Validate cơ bản: thiếu thông tin -> 400 Bad Request
    if (!loginId || !password) {
      return error(res, 'Username/Email and password are required', 400);
    }

    // Đẩy logic xuống service (hash check, query DB)
    const user = await authService.login(loginId, password);

    // service trả null = không tìm thấy hoặc sai mật khẩu
    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    // Tạo JWT chứa thông tin nhận dạng user (id, username, role)
    // Token này sẽ được FE lưu vào localStorage và gửi kèm các request sau
    const token = generateToken({
      id: user.Id,
      username: user.Username,
      role: user.Role
    });

    // Trả thông tin user (KHÔNG có password) + token cho FE
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
    // Map mã lỗi nghiệp vụ -> HTTP status phù hợp
    if (err.message === 'NOT_VERIFIED') {
      // 403 = đăng nhập đúng nhưng tài khoản chưa kích hoạt qua OTP
      return error(res, 'Tài khoản chưa xác thực Email. Vui lòng xác thực trước khi đăng nhập.', 403);
    }
    return error(res, err.message || 'Login failed', 500);
  }
};



// REGISTER: POST /api/auth/register
// Đăng ký tài khoản mới và TỰ ĐỘNG GỬI OTP qua email
// Body: { email, password, fullName, phone }

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName || !phone) {
      return error(res, 'Thiếu thông tin đăng ký', 400);
    }

    // Service sẽ: hash password + tạo OTP + lưu DB + gửi email
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


// VERIFY OTP: POST /api/auth/verify-otp
// User nhập mã OTP nhận qua email -> kích hoạt tài khoản

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
    // Map các trạng thái nghiệp vụ trả về từ Stored Procedure
    if (err.message === 'ALREADY_VERIFIED') return error(res, 'Tài khoản đã được xác thực trước đó.', 400);
    if (err.message === 'INVALID_OR_EXPIRED_OTP') return error(res, 'Mã OTP không chính xác hoặc đã hết hạn.', 400);
    if (err.message === 'USER_NOT_FOUND') return error(res, 'Không tìm thấy người dùng.', 404);
    return error(res, 'Xác thực thất bại', 500);
  }
};



// ME: GET /api/auth/me  (cần đăng nhập)
// Lấy thông tin user hiện tại từ token + truy vấn thêm DB
// req.user đã được middleware requireAuth gắn từ token

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return error(res, 'User not authenticated', 401);
    }

    // Lấy thông tin "tươi" từ DB (token chỉ chứa snapshot lúc đăng nhập)
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


// UPDATE ME: PUT /api/auth/me
// User cập nhật thông tin cá nhân của chính mình

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


// FORGOT PASSWORD: POST /api/auth/forgot-password
// Gửi mã OTP về email để user đặt lại mật khẩu
// ------------------------------------------------------------
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


// RESET PASSWORD: POST /api/auth/reset-password
// User nhập email + OTP nhận được + mật khẩu mới -> đặt lại

export const resetPasswordWithOTP = async (req: Request, res: Response) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return error(res, 'Vui lòng nhập đầy đủ thông tin', 400);
    }

    // Validate độ mạnh mật khẩu cơ bản
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



// SEND OTP TO CHANGE PASSWORD: POST /api/auth/me/send-otp
// User đã đăng nhập, muốn đổi mật khẩu -> gửi OTP đến email họ
// (Mục đích: 2-factor để đổi MK an toàn hơn)

export const sendChangePasswordOTP = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return error(res, 'Vui lòng đăng nhập', 401);

    const userProfile = await authService.getProfile(req.user.id);
    if (!userProfile) return error(res, 'Không tìm thấy người dùng', 404);

    // Tận dụng lại logic gửi OTP của forgot-password
    await authService.forgotPasswordSendOTP(userProfile.Email);
    return success(res, null, 'Mã xác thực đã được gửi đến email của bạn');
  } catch (err: any) {
    console.error('Send change password OTP error:', err);
    return error(res, 'Lỗi gửi mã xác thực', 500);
  }
};


// CHANGE PASSWORD: PUT /api/auth/me/change-password
// Yêu cầu: mật khẩu cũ ĐÚNG + OTP HỢP LỆ + mật khẩu mới hợp lệ
// (3 lớp xác thực để bảo vệ user)

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


// GOOGLE LOGIN: POST /api/auth/google-login
// FE gửi lên Google ID token (thu được từ component @react-oauth/google)
// BE verify token -> lấy email/name/avatar -> tạo/login user trong DB

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return error(res, 'Google token is required', 400);
    }

    // Bước 1: Xác thực ID token với Google
    // (Đảm bảo token đó được Google ký, đúng audience là client app của mình)
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return error(res, 'Invalid Google token', 401);
    }

    // Bước 2: Trích thông tin user từ payload Google trả về
    const { email, sub: googleId, name, picture } = payload;

    if (!email) {
       return error(res, 'Google account missing email', 400);
    }

    // Bước 3: Tìm user trong DB theo email/googleId; nếu chưa có thì tạo mới
    const user = await authService.loginWithGoogle(email, googleId, name || '', picture || '');

    // Bước 4: Tạo JWT của HỆ THỐNG MÌNH (không dùng Google token nữa)
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
