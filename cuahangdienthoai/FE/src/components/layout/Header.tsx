
// FILE: Header.tsx - HEADER TRANG STOREFRONT

// Bao gồm:
//   - Topbar (hotline, địa chỉ, thông tin)
//   - Logo + Search box (có dropdown gợi ý theo từng phím gõ)
//   - Action: Hồ sơ / Đăng nhập + Giỏ hàng (có badge số lượng)
//   - Navigation menu (có mobile menu)
//
// Kỹ thuật đáng chú ý:
//   - Debounce search bằng setTimeout + clearTimeout
//   - Click outside (đóng dropdown khi click ngoài) bằng useEffect + ref
//   - Dùng cartItemCount từ Context để hiển thị badge giỏ hàng


import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import catalogApi from '../../api/catalogApi';
import '../../assets/Header.css';

const Header: React.FC = () => {
  // ---- State chính ----
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItemCount } = useCart();             // Số sản phẩm trong giỏ
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  // ---- State cho dropdown gợi ý tìm kiếm ----
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // useRef để giữ tham chiếu giữa các lần render mà không trigger re-render
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);  // Lưu timeout hiện tại để clear
  const searchRef = useRef<HTMLDivElement>(null);                // Ref đến vùng search để check click outside

  // ----------------------------------------------------------
  // HANDLER: Khi user gõ vào ô search
  // Áp dụng kỹ thuật DEBOUNCE để không gọi API mỗi lần gõ
  // ----------------------------------------------------------
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    // Huỷ timeout trước (nếu user vẫn đang gõ tiếp)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    // Ô trống -> clear kết quả
    if (!val.trim()) {
       setSearchResults([]);
       setIsSearching(false);
       return;
    }

    setIsSearching(true);
    // Đặt timeout: chỉ gọi API SAU 1ms gõ xong (TODO: nên tăng lên 300-400ms)
    searchTimeoutRef.current = setTimeout(() => {
       catalogApi.getProducts({ keyword: val, pageSize: 5 }).then((res: any) => {
           // BE trả response có thể là { products: [...] } hoặc { data: { products: [...] } }
           // -> dùng OR fallback để chắc chắn có dữ liệu
           setSearchResults(res.data?.products || res.products || []);
           setIsSearching(false);
       }).catch((err: any) => {
           console.error(err);
           setIsSearching(false);
       });
    }, 1);
  };

  // ----------------------------------------------------------
  // HANDLER: Submit form search (Enter / click nút)
  // ----------------------------------------------------------
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchResults([]);  // Đóng dropdown
      // encodeURIComponent để xử lý ký tự đặc biệt trong URL (dấu cách, &, ...)
      navigate(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // ----------------------------------------------------------
  // EFFECT: Đóng dropdown khi user click ra ngoài vùng search
  // ----------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup: gỡ event khi component unmount để tránh memory leak
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ----------------------------------------------------------
  // EFFECT: Load danh sách category 1 lần để hiển thị trong menu dropdown
  // ----------------------------------------------------------
  useEffect(() => {
    catalogApi.getCategories()
      .then((res: any) => setCategories(res.data?.categories || res.categories || []))
      .catch(console.error);
  }, []);

  return (
    <header className="header">
      {/* ===== TOP BAR (hotline, địa chỉ) ===== */}
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

      {/* ===== HEADER CHÍNH (logo + search + actions) ===== */}
      <div className="header-main">
        <div className="container">
          <div className="header-inner">
            {/* Logo */}
            <div className="header-logo">
              <Link to="/">
                <span className="logo-text"><ion-icon name="phone-portrait-outline"></ion-icon> CỬA HÀNG DI ĐỘNG</span>
              </Link>
            </div>

            {/* Ô search có dropdown gợi ý */}
            <div className="header-search" ref={searchRef}>
              <form className="search-box" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Tìm kiếm điện thoại, phụ kiện..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={handleSearchInput}   // Mở lại dropdown nếu focus
                />
                <button type="submit" className="search-btn"><ion-icon name="search-outline"></ion-icon></button>
              </form>

              {/* Dropdown chỉ hiển thị khi có query + (có kết quả hoặc đang search) */}
              {searchQuery.trim() && (searchResults.length > 0 || isSearching) && (
                <div className="search-suggestions">
                   {isSearching ? (
                     <div className="suggestion-item">Đang tìm...</div>
                   ) : (
                     // Render từng item kết quả
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
                             {/* Format số tiền theo locale Việt Nam */}
                             <div className="suggestion-price">{p.PriceSell.toLocaleString('vi-VN')} ₫</div>
                          </div>
                       </Link>
                     ))
                   )}
                </div>
              )}
            </div>

            {/* Action buttons: gọi điện, profile/login, giỏ hàng */}
            <div className="header-actions">
              <a href="tel:18006868" className="action-item">
                <span className="action-icon"><ion-icon name="call"></ion-icon></span>
                <span className="action-text">Gọi ngay</span>
              </a>

              {/* Hiển thị Hồ sơ nếu đã đăng nhập, ngược lại hiện nút Đăng nhập */}
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

              {/* Giỏ hàng có badge số lượng (chỉ hiện khi > 0) */}
              <Link to="/cart" className="action-item">
                <span className="action-icon"><ion-icon name="cart-outline"></ion-icon></span>
                <span className="action-text">Giỏ hàng</span>
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>

              {/* Nút mở mobile menu (chỉ hiện trên mobile qua CSS) */}
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

      {/* ===== NAVIGATION MENU ===== */}
      <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="container">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/"><ion-icon name="home-outline"></ion-icon> Trang Chủ</Link>
            </li>
            {/* Item có dropdown danh mục con */}
            <li className="nav-item has-dropdown">
              <Link to="/products"><ion-icon name="grid-outline"></ion-icon> Danh Mục</Link>
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
