import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-icon"><ion-icon name="warning-outline"></ion-icon></span>
        <h1>404</h1>
        <p>Trang bạn tìm không tồn tại.</p>
        <Link to="/" className="home-btn">← Về trang chủ</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
