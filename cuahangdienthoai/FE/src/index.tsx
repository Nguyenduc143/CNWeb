
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Provider của thư viện đăng nhập Google - bọc app để các component
// con có thể dùng <GoogleLogin /> và useGoogleLogin()
import { GoogleOAuthProvider } from '@react-oauth/google';

// React 18+: tạo root mới thay vì ReactDOM.render() cũ
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // StrictMode: bật cảnh báo các pattern lỗi thời, KHÔNG ảnh hưởng production
  // (chỉ chạy effect 2 lần ở dev để bắt bug, prod chỉ chạy 1 lần)
  <React.StrictMode>
    {/* Bọc app trong GoogleOAuthProvider, truyền clientId của OAuth app */}
    {/* TODO: nên đẩy clientId này ra biến môi trường (REACT_APP_GOOGLE_CLIENT_ID) */}
    <GoogleOAuthProvider clientId="632102369385-vqlq1q2m3g44vr3hm9t30u04s4nb377o.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Đo hiệu năng web vitals (LCP, FID, CLS) - không bắt buộc
reportWebVitals();
