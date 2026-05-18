import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import authApi from '../../api/authApi';
import { GoogleLogin } from '@react-oauth/google';
import '../../assets/Auth.css';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!fullName || !email || !phone || !password) {
      return message.warning('Vui lòng điền đầy đủ thông tin (Họ tên, Email, SĐT, Mật khẩu) trước khi gửi mã.');
    }
    setIsSendingOtp(true);
    try {
      await authApi.register({ fullName, email, phone, password });
      setIsOtpSent(true);
      message.success('Mã xác thực đã được gửi! Vui lòng kiểm tra email của bạn.');
    } catch (error: any) {
      if (error?.message === 'Email already in use' || error?.message === 'EMAIL_EXISTS') {
        message.error('Email này đã được sử dụng. Nếu bạn chưa xác thực, vui lòng dùng tính năng Quên mật khẩu để đặt lại.');
      } else {
        message.error(typeof error === 'string' ? error : error?.message || 'Đăng ký thất bại.');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      return message.warning('Vui lòng bấm "Gửi mã" để nhận OTP trước khi Đăng ký.');
    }
    if (!otpCode) {
      return message.warning('Vui lòng nhập mã OTP.');
    }
    try {
      await authApi.verifyOTP({ email, otpCode });
      message.success('Tạo tài khoản và Xác thực thành công! Mời bạn đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      message.error(typeof error === 'string' ? error : error?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <ion-icon name="person-add-outline"></ion-icon>
          <h2>Tạo Tài Khoản</h2>
          <p>Tham gia với chúng tôi ngay hôm nay</p>
        </div>
        
        <form className="auth-form" onSubmit={handleVerifyAndRegister}>
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <div className="input-wrapper">
                <ion-icon name="person-outline"></ion-icon>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <ion-icon name="mail-outline"></ion-icon>
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <div className="input-wrapper">
                <ion-icon name="call-outline"></ion-icon>
                <input
                  type="tel"
                  id="phone"
                  placeholder="09xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-wrapper">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu bảo mật"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="otpCode">Mã xác thực (OTP)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <ion-icon name="keypad-outline"></ion-icon>
                  <input
                    type="text"
                    id="otpCode"
                    placeholder="Nhập mã 6 số"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    required={isOtpSent}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  disabled={isSendingOtp}
                  style={{ 
                    background: isSendingOtp ? '#95a5a6' : '#0066cc', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    padding: '0 15px', 
                    cursor: isSendingOtp ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}>
                  {isSendingOtp ? 'Đang gửi...' : (isOtpSent ? 'Gửi lại mã' : 'Gửi mã')}
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn-auth">
              Đăng Ký Tài Khoản <ion-icon name="checkmark-circle-outline"></ion-icon>
            </button>
            
            <div className="auth-divider">
              <span>HOẶC</span>
            </div>
            
            <div className="google-login-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      const res: any = await authApi.googleLogin(credentialResponse.credential);
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
                useOneTap
              />
            </div>
          </form>

        
        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
