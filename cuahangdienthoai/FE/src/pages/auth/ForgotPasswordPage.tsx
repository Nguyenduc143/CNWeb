import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import '../../assets/Auth.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.forgotPassword({ email, phone, newPassword });
      alert('Tuyệt vời! Mật khẩu của bạn đã được đặt lại thành công.');
      navigate('/login');
    } catch (error: any) {
      alert(typeof error === 'string' ? error : error?.message || 'Có lỗi xảy ra, vui lòng kiểm tra lại thông tin.');
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
            <label htmlFor="phone">Số điện thoại đăng ký</label>
            <div className="input-wrapper">
              <ion-icon name="call-outline"></ion-icon>
              <input
                type="tel"
                id="phone"
                placeholder="Nhập SĐT"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
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
