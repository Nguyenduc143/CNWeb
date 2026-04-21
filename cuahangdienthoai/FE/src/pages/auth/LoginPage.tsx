import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import '../../assets/Auth.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await authApi.login({ email, password });
      // Xóa triệt để các phiên bản token cũ trước khi ghi mới
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');

      // Đã sửa lại thành res.token theo chuẩn Backend mới
      if (rememberMe) {
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('remembered_email', email);
      } else {
        sessionStorage.setItem('access_token', res.token);
        localStorage.removeItem('remembered_email');
      }
      alert('Đăng nhập thành công! Xin chào ' + (res.user?.fullName || res.user?.username));
      
      // Luôn chuyển về trang chủ (cửa hàng) sau khi đăng nhập thành công
      window.location.href = '/';
    } catch (error: any) {
      alert(typeof error === 'string' ? error : error?.message || 'Đăng nhập thất bại.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <ion-icon name="log-in-outline"></ion-icon>
          <h2>Đăng Nhập</h2>
          <p>Chào mừng bạn quay lại hệ thống</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
          
          <button type="submit" className="btn-auth">
            Đăng Nhập <ion-icon name="arrow-forward-outline"></ion-icon>
          </button>
        </form>
        
        <div className="auth-footer">
          Chưa có tài khoản? <Link to="/register" className="auth-link">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
