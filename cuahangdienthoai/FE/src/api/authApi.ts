import axiosClient from './axiosClient';
import { User } from '../data/types';

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

const authApi = {
  // Đăng nhập
  login(params: LoginParams): Promise<AuthResponse> {
    const url = '/auth/login';
    return axiosClient.post(url, params);
  },
  
  // Đăng ký
  register(params: RegisterParams): Promise<AuthResponse> {
    const url = '/auth/register';
    return axiosClient.post(url, params);
  },

  // Lấy User profile dựa trên Authorization token đã gửi tự động theo axiosClient
  getProfile(): Promise<{status: string, data: {user: User}}> {
    const url = '/auth/me';
    return axiosClient.get(url);
  },

  updateProfile(data: { fullName: string; phone: string }): Promise<any> {
    const url = '/auth/me';
    return axiosClient.put(url, data);
  },

  forgotPassword(data: { email: string; phone: string; newPassword: string }): Promise<any> {
    const url = '/auth/forgot-password';
    return axiosClient.post(url, data);
  },

  changePassword(data: { oldPassword: string; newPassword: string }): Promise<any> {
    const url = '/auth/me/change-password';
    return axiosClient.put(url, data);
  }
};

export default authApi;
