import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import authApi from '../../api/authApi';
import '../../assets/Auth.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      return message.error('Vui lòng nhập Email trước khi gửi mã.');
    }
    setIsSendingOtp(true);
    try {
      await authApi.forgotPassword({ email });
      message.success('Mã xác thực đã được gửi! Vui lòng kiểm tra email của bạn.');
    } catch (error: any) {
      message.error(typeof error === 'string' ? error : error?.message || 'Không thể gửi mã xác thực.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.resetPassword({ email, otpCode, newPassword });
      message.success('Tuyệt vời! Mật khẩu của bạn đã được đặt lại thành công.');
      navigate('/login');
    } catch (error: any) {
      message.error(typeof error === 'string' ? error : error?.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <ion-icon name="key-outline"></ion-icon>
          <h2>Quên Mật Khẩu</h2>
          <p>Nhập email và SĐT để đặt lại mật khẩu</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email đã đăng ký</label>
            <div className="input-wrapper">
              <ion-icon name="mail-outline"></ion-icon>
              <input
                type="email"
                id="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  required
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
                {isSendingOtp ? 'Đang gửi...' : 'Gửi mã'}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <div className="input-wrapper">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input
                type="password"
                id="newPassword"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-auth">
            Đặt Lại Mật Khẩu <ion-icon name="checkmark-outline"></ion-icon>
          </button>
        </form>
        
        <div className="auth-footer">
          Đã nhớ mật khẩu? <Link to="/login" className="auth-link">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
