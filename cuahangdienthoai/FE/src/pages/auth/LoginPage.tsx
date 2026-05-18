
// FILE: LoginPage.tsx - TRANG ĐĂNG NHẬP
// ------------------------------------------------------------
// 2 cách đăng nhập:
//   1. Email + Password (form thường)
//   2. Google Sign-In (one-tap)
//
// Sau khi login thành công:
//   - Lưu access_token vào localStorage để các request sau dùng được
//   - "Ghi nhớ tôi" -> lưu thêm email để form tự fill cho lần sau
//   - Điều hướng về trang chủ


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';                    // Toast của AntD
import authApi from '../../api/authApi';
import { GoogleLogin } from '@react-oauth/google'; // Component Google Sign-In
import '../../assets/Auth.css';

const LoginPage: React.FC = () => {
  // ---- State của form ----
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // EFFECT: Tự fill email nếu trước đây user đã chọn "Ghi nhớ tôi"
  // ----------------------------------------------------------
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ----------------------------------------------------------
  // HANDLER: Submit form đăng nhập email + password
  // ----------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Chặn reload trang mặc định của form
    try {
      // Gọi API login
      const res: any = await authApi.login({ email, password });

      // Lưu token vào localStorage để duy trì đăng nhập qua các tab
      localStorage.setItem('access_token', res.token);

      // Xử lý "Ghi nhớ tôi": chỉ lưu/xoá EMAIL (không phải password)
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      // Báo thành công và chuyển về trang chủ
      message.success('Đăng nhập thành công! Xin chào ' + (res.user?.fullName || res.user?.username));
      navigate('/');
    } catch (error: any) {
      // BE trả lỗi (sai mật khẩu, chưa xác thực OTP, tài khoản bị khoá...)
      message.error(typeof error === 'string' ? error : error?.message || 'Đăng nhập thất bại.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* ===== HEADER CARD ===== */}
        <div className="auth-header">
          <ion-icon name="log-in-outline"></ion-icon>
          <h2>Đăng Nhập</h2>
          <p>Chào mừng bạn quay lại hệ thống</p>
        </div>

        {/* ===== FORM ĐĂNG NHẬP ===== */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Trường Email */}
          <div className="form-group">
            <label htmlFor="email">Email / Số điện thoại</label>
            <div className="input-wrapper">
              <ion-icon name="mail-outline"></ion-icon>
              <input
                type="text"
                id="email"
                placeholder="Nhập email hoặc SĐT"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required  // HTML5 validation cơ bản
              />
            </div>
          </div>

          {/* Trường Password + Remember + Forgot */}
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Ghi nhớ tôi
              </label>
              <Link to="/forgot-password" className="forgot-password">Quên mật khẩu?</Link>
            </div>
          </div>

          {/* Submit button (gửi form) */}
          <button type="submit" className="btn-auth">
            Đăng Nhập <ion-icon name="arrow-forward-outline"></ion-icon>
          </button>

          {/* Vạch ngăn HOẶC */}
          <div className="auth-divider">
            <span>HOẶC</span>
          </div>

          {/* ===== ĐĂNG NHẬP GOOGLE ===== */}
          <div className="google-login-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
            <GoogleLogin
              // onSuccess: Google đã trả về credentialResponse chứa idToken
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    // Gửi idToken này về BE để verify + tạo phiên đăng nhập của hệ thống
                    const res: any = await authApi.googleLogin(credentialResponse.credential);

                    // Xoá token cũ (nếu còn) rồi lưu token mới
                    localStorage.removeItem('access_token');
                    sessionStorage.removeItem('access_token');
                    localStorage.setItem('access_token', res.token);

                    message.success('Đăng nhập Google thành công! Xin chào ' + (res.user?.fullName || res.user?.username));
                    navigate('/');
                  } catch (error: any) {
                    message.error(typeof error === 'string' ? error : error?.message || 'Đăng nhập Google thất bại.');
                  }
                }
              }}
              onError={() => {
                message.error('Đăng nhập Google thất bại');
              }}
              useOneTap   // Hiện popup "Đăng nhập với Google" tự động
            />
          </div>
        </form>

        {/* ===== LINK ĐĂNG KÝ ===== */}
        <div className="auth-footer">
          Chưa có tài khoản? <Link to="/register" className="auth-link">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
