
// FILE: authApi.ts - WRAPPER CÁC API XÁC THỰC (AUTH)
// ------------------------------------------------------------
// Tách thành module riêng để:
//   - Tập trung mọi URL auth vào 1 chỗ, dễ thay đổi
//   - Cung cấp type cho params/response (TypeScript an toàn)
//   - Page chỉ cần import authApi.login() thay vì gọi axios trực tiếp


import axiosClient from './axiosClient';
import { User } from '../data/types';


// TYPES: định nghĩa hình dạng payload và response


export interface LoginParams {
  email: string;
  password?: string;
}

export interface RegisterParams {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  message?: string;
}

// ------------------------------------------------------------
// authApi: object gom tất cả method gọi BE
// ------------------------------------------------------------
const authApi = {
  // Đăng nhập email + password
  login(params: LoginParams): Promise<AuthResponse> {
    const url = '/auth/login';
    return axiosClient.post(url, params);
  },

  // Đăng ký tài khoản (BE sẽ gửi OTP về email)
  register(params: RegisterParams): Promise<AuthResponse> {
    const url = '/auth/register';
    return axiosClient.post(url, params);
  },

  // Lấy thông tin user hiện tại (token được gắn tự động bởi axiosClient)
  getProfile(): Promise<{status: string, data: {user: User}}> {
    const url = '/auth/me';
    return axiosClient.get(url);
  },

  // Cập nhật tên + SĐT
  updateProfile(data: { fullName: string; phone: string }): Promise<any> {
    const url = '/auth/me';
    return axiosClient.put(url, data);
  },

  // Quên mật khẩu - gửi OTP qua email
  forgotPassword(data: { email: string }): Promise<any> {
    const url = '/auth/forgot-password';
    return axiosClient.post(url, data);
  },

  // Đặt lại mật khẩu sau khi nhận OTP
  resetPassword(data: { email: string; otpCode: string; newPassword: string }): Promise<any> {
    const url = '/auth/reset-password';
    return axiosClient.post(url, data);
  },

  // Gửi OTP để đổi mật khẩu (cần đăng nhập)
  sendChangePasswordOTP(): Promise<any> {
    const url = '/auth/me/send-otp';
    return axiosClient.post(url);
  },

  // Đổi mật khẩu (cần: oldPassword + newPassword + OTP)
  changePassword(data: { oldPassword: string; newPassword: string; otpCode: string }): Promise<any> {
    const url = '/auth/me/change-password';
    return axiosClient.put(url, data);
  },

  // Đăng nhập bằng Google ID token (sau khi user click nút Google trên FE)
  googleLogin(token: string): Promise<AuthResponse> {
    const url = '/auth/google-login';
    return axiosClient.post(url, { token });
  },

  // Xác thực OTP đăng ký để kích hoạt tài khoản
  verifyOTP(data: { email: string; otpCode: string }): Promise<any> {
    const url = '/auth/verify-otp';
    return axiosClient.post(url, data);
  }
};

export default authApi;
