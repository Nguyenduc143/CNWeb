import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import '../../assets/Auth.css';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.register({ fullName, email, phone, password });
      alert('Đăng ký tài khoản thành công! Mời bạn đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      alert(typeof error === 'string' ? error : error?.message || 'Đăng ký thất bại.');
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
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
          
          <button type="submit" className="btn-auth">
            Đăng Ký Tài Khoản <ion-icon name="checkmark-circle-outline"></ion-icon>
          </button>
        </form>
        
        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
