import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/Header.css';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* Top bar */}
      <div className="header-topbar">
        <div className="container">
          <div className="topbar-left">
            <span>📞 Hotline: <strong>1800 6868</strong></span>
            <span>📍 94 Thái Hà &amp; 398 Cầu Giấy, Hà Nội</span>
          </div>
          <div className="topbar-right">
            <span>🚚 Miễn phí ship toàn quốc</span>
            <span>⭐ Bảo hành chính hãng</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="header-main">
        <div className="container">
          <div className="header-inner">
            {/* Logo */}
            <div className="header-logo">
              <Link to="/">
                <span className="logo-text">📱 CỬA HÀNG DI ĐỘNG</span>
              </Link>
            </div>

            {/* Search */}
            <div className="header-search">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Tìm kiếm điện thoại, phụ kiện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn">🔍</button>
              </div>
            </div>

            {/* Actions */}
            <div className="header-actions">
              <a href="tel:18006868" className="action-item">
                <span className="action-icon">📞</span>
                <span className="action-text">Gọi ngay</span>
              </a>
              <a href="/cart" className="action-item">
                <span className="action-icon">🛒</span>
                <span className="action-text">Giỏ hàng</span>
                <span className="cart-badge">0</span>
              </a>
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="container">
          <ul className="nav-list">
            <li className="nav-item has-dropdown">
              <Link to="/dien-thoai">📱 Điện Thoại</Link>
              <ul className="dropdown">
                <li><Link to="/iphone">iPhone</Link></li>
                <li><Link to="/samsung">Samsung</Link></li>
                <li><Link to="/oppo">Oppo</Link></li>
                <li><Link to="/xiaomi">Xiaomi</Link></li>
              </ul>
            </li>
            <li className="nav-item has-dropdown">
              <Link to="/phu-kien">🎧 Phụ Kiện</Link>
              <ul className="dropdown">
                <li><Link to="/tai-nghe">Tai nghe</Link></li>
                <li><Link to="/loa">Loa Bluetooth</Link></li>
                <li><Link to="/op-lung">Ốp lưng</Link></li>
                <li><Link to="/sac">Sạc &amp; cáp</Link></li>
              </ul>
            </li>
            <li className="nav-item has-dropdown">
              <Link to="/sua-chua">🔧 Sửa Chữa</Link>
              <ul className="dropdown">
                <li><Link to="/sua-iphone">Sửa iPhone</Link></li>
                <li><Link to="/sua-samsung">Sửa Samsung</Link></li>
                <li><Link to="/thay-man-hinh">Thay màn hình</Link></li>
                <li><Link to="/thay-pin">Thay pin</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/tablet">📟 Tablet</Link>
            </li>
            <li className="nav-item">
              <Link to="/tra-gop">💳 Trả Góp</Link>
            </li>
            <li className="nav-item">
              <Link to="/tin-tuc">📰 Tin Tức</Link>
            </li>
            <li className="nav-item">
              <Link to="/gioi-thieu">ℹ️ Về Chúng Tôi</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
