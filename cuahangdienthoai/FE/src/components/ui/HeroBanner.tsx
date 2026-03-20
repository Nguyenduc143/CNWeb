import React, { useState, useEffect } from 'react';
import '../../assets/HeroBanner.css';

const banners = [
  {
    id: 1,
    title: 'iPhone 16 Pro Max',
    subtitle: 'Siêu phẩm mới nhất từ Apple',
    description: 'Camera 48MP, chip A18 Pro, màn hình 6.9" ProMotion',
    price: 'Từ 32.900.000 ₫',
    image: 'https://galaxydidong.vn/wp-content/uploads/2025/01/iPhone-16-Pro-Max-512GB-Chinh-Hang.jpg',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    btnText: 'Mua ngay',
    btnLink: '/iphone',
    tagText: 'HOT',
    tagIcon: 'flame',
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Công nghệ AI đỉnh cao',
    description: 'Bút S Pen tích hợp, Galaxy AI, màn hình Dynamic AMOLED 2X',
    price: 'Từ 28.900.000 ₫',
    image: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Samsung-Galaxy-S24-Ultra-5G-512GB.jpg',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a237e 50%, #283593 100%)',
    btnText: 'Khám phá',
    btnLink: '/samsung',
    tagText: 'MỚI',
    tagIcon: 'star',
  },
  {
    id: 3,
    title: 'Galaxy Z Fold6',
    subtitle: 'Điện thoại gập thế hệ mới',
    description: 'Màn hình gập 7.6", thiết kế mỏng nhẹ, hiệu năng vượt trội',
    price: 'Từ 35.000.000 ₫',
    image: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Galaxy-Z-Fold6-5G-12G-ban-512GB-1.jpg',
    bg: 'linear-gradient(135deg, #1b1b2f 0%, #2d2b55 50%, #1565c0 100%)',
    btnText: 'Xem thêm',
    btnLink: '/samsung',
    tagText: 'CAO CẤP',
    tagIcon: 'diamond-outline',
  },
];

const HeroBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const banner = banners[current];

  return (
    <div className="hero-banner">
      <div className="banner-slide" style={{ background: banner.bg }}>
        <div className="container">
          <div className="banner-content">
            <div className="banner-text">
              <span className="banner-tag"><ion-icon name={banner.tagIcon}></ion-icon> {banner.tagText}</span>
              <h1 className="banner-title">{banner.title}</h1>
              <p className="banner-subtitle">{banner.subtitle}</p>
              <p className="banner-desc">{banner.description}</p>
              <p className="banner-price">{banner.price}</p>
              <a href={banner.btnLink} className="banner-btn">
                {banner.btnText} <ion-icon name="arrow-forward"></ion-icon>
              </a>
            </div>
            <div className="banner-image">
              <img src={banner.image} alt={banner.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="banner-dots">
        {banners.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        className="banner-arrow left"
        onClick={() => setCurrent((current - 1 + banners.length) % banners.length)}
      >
        <ion-icon name="chevron-back"></ion-icon>
      </button>
      <button
        className="banner-arrow right"
        onClick={() => setCurrent((current + 1) % banners.length)}
      >
        <ion-icon name="chevron-forward"></ion-icon>
      </button>
    </div>
  );
};

export default HeroBanner;
