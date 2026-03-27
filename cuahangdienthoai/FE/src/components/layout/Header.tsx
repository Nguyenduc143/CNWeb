import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../assets/Header.css';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItemCount } = useCart();

  return (
    <header className="header">
      {/* Top bar */}
      <div className="header-topbar">
        <div className="container">
          <div className="topbar-left">
            <span><ion-icon name="call-outline"></ion-icon> Hotline: <strong>1800 6868</strong></span>
            <span><ion-icon name="location-outline"></ion-icon> 94 Thái Hà &amp; 398 Cầu Giấy, Hà Nội</span>
          </div>
          <div className="topbar-right">
            <span><ion-icon name="bus-outline"></ion-icon> Miễn phí ship toàn quốc</span>
            <span><ion-icon name="star-outline"></ion-icon> Bảo hành chính hãng</span>
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
                <span className="logo-text"><ion-icon name="phone-portrait-outline"></ion-icon> CỬA HÀNG DI ĐỘNG</span>
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
                <button className="search-btn"><ion-icon name="search-outline"></ion-icon></button>
              </div>
            </div>

            {/* Actions */}
            <div className="header-actions">
              <a href="tel:18006868" className="action-item">
                <span className="action-icon"><ion-icon name="call"></ion-icon></span>
                <span className="action-text">Gọi ngay</span>
              </a>
              {localStorage.getItem('access_token') ? (
                <Link to="/profile" className="action-item">
                  <span className="action-icon"><ion-icon name="person-circle-outline"></ion-icon></span>
                  <span className="action-text">Hồ sơ</span>
                </Link>
              ) : (
                <Link to="/login" className="action-item">
                  <span className="action-icon"><ion-icon name="person-circle-outline"></ion-icon></span>
                  <span className="action-text">Đăng nhập</span>
                </Link>
              )}
              <Link to="/cart" className="action-item">
                <span className="action-icon"><ion-icon name="cart-outline"></ion-icon></span>
                <span className="action-text">Giỏ hàng</span>
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <ion-icon name="menu-outline"></ion-icon>
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
              <Link to="/dien-thoai"><ion-icon name="phone-portrait-outline"></ion-icon> Điện Thoại</Link>
              <ul className="dropdown">
                <li><Link to="/iphone">iPhone</Link></li>
                <li><Link to="/samsung">Samsung</Link></li>
                <li><Link to="/oppo">Oppo</Link></li>
                <li><Link to="/xiaomi">Xiaomi</Link></li>
              </ul>
            </li>
            <li className="nav-item has-dropdown">
              <Link to="/phu-kien"><ion-icon name="headset-outline"></ion-icon> Phụ Kiện</Link>
              <ul className="dropdown">
                <li><Link to="/tai-nghe">Tai nghe</Link></li>
                <li><Link to="/loa">Loa Bluetooth</Link></li>
                <li><Link to="/op-lung">Ốp lưng</Link></li>
                <li><Link to="/sac">Sạc &amp; cáp</Link></li>
              </ul>
            </li>
            <li className="nav-item has-dropdown">
              <Link to="/sua-chua"><ion-icon name="construct-outline"></ion-icon> Sửa Chữa</Link>
              <ul className="dropdown">
                <li><Link to="/sua-iphone">Sửa iPhone</Link></li>
                <li><Link to="/sua-samsung">Sửa Samsung</Link></li>
                <li><Link to="/thay-man-hinh">Thay màn hình</Link></li>
                <li><Link to="/thay-pin">Thay pin</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/tablet"><ion-icon name="tablet-portrait-outline"></ion-icon> Tablet</Link>
            </li>
            <li className="nav-item">
              <Link to="/tra-gop"><ion-icon name="card-outline"></ion-icon> Trả Góp</Link>
            </li>
            <li className="nav-item">
              <Link to="/tin-tuc"><ion-icon name="newspaper-outline"></ion-icon> Tin Tức</Link>
            </li>
            <li className="nav-item">
              <Link to="/gioi-thieu"><ion-icon name="information-circle-outline"></ion-icon> Về Chúng Tôi</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
