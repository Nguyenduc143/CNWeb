import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import catalogApi from '../../api/catalogApi';
import '../../assets/Header.css';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItemCount } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!val.trim()) {
       setSearchResults([]);
       setIsSearching(false);
       return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
       catalogApi.getProducts({ keyword: val, pageSize: 5 }).then((res: any) => {
           setSearchResults(res.data?.products || res.products || []);
           setIsSearching(false);
       }).catch((err: any) => {
           console.error(err);
           setIsSearching(false);
       });
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchResults([]); // close dropdown
      navigate(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    catalogApi.getCategories()
      .then((res: any) => setCategories(res.data?.categories || res.categories || []))
      .catch(console.error);
  }, []);

  return (
    <header className="header">
      {/* Top bar */}
      <div className="header-topbar">
        <div className="container">
          <div className="topbar-left">
            <span><ion-icon name="call-outline"></ion-icon> Hotline: <strong>0967688908</strong></span>
            <span><ion-icon name="location-outline"></ion-icon> Mỹ Hào, Hưng Yên &amp; Yên Mỹ, Hưng Yên</span>
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
            <div className="header-search" ref={searchRef}>
              <form className="search-box" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Tìm kiếm điện thoại, phụ kiện..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={handleSearchInput}
                />
                <button type="submit" className="search-btn"><ion-icon name="search-outline"></ion-icon></button>
              </form>
              
              {/* Dropdown Suggestions */}
              {searchQuery.trim() && (searchResults.length > 0 || isSearching) && (
                <div className="search-suggestions">
                   {isSearching ? (
                     <div className="suggestion-item">Đang tìm...</div>
                   ) : (
                     searchResults.map(p => (
                       <Link 
                         key={p.ProductId} 
                         to={`/san-pham/${p.Slug}`} 
                         className="suggestion-item" 
                         onClick={() => { setSearchResults([]); setSearchQuery(''); }}
                       >
                          <img src={p.Image1} alt={p.Name} />
                          <div className="suggestion-info">
                             <div className="suggestion-name">{p.Name}</div>
                             <div className="suggestion-price">{p.PriceSell.toLocaleString('vi-VN')} ₫</div>
                          </div>
                       </Link>
                     ))
                   )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="header-actions">
              <a href="tel:18006868" className="action-item">
                <span className="action-icon"><ion-icon name="call"></ion-icon></span>
                <span className="action-text">Gọi ngay</span>
              </a>
              {(localStorage.getItem('access_token') || sessionStorage.getItem('access_token')) ? (
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
            <li className="nav-item">
              <Link to="/"><ion-icon name="home-outline"></ion-icon> Trang Chủ</Link>
            </li>
            <li className="nav-item has-dropdown">
              <Link to="#"><ion-icon name="grid-outline"></ion-icon> Danh Mục</Link>
              <ul className="dropdown">
                {categories.map((c) => (
                  <li key={c.CategoryId}>
                    <Link to={`/danh-muc/${c.CategoryId}`}>{c.Name}</Link>
                  </li>
                ))}
              </ul>
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
