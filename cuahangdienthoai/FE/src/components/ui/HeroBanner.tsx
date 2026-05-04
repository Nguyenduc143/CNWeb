import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import '../../assets/HeroBanner.css';

interface Banner {
  MaBanner: number;
  TieuDe: string;
  TieuDePhu: string;
  MoTa: string;
  GiaHienThi: string;
  NutText: string;
  NutLink: string;
  HinhAnh: string;
  MauNen: string;
  TagText: string;
  TagIcon: string;
  ThuTu: number;
}

// ── Static fallback (khi API chưa sẵn sàng) ──
const FALLBACK_BANNERS: Banner[] = [
  {
    MaBanner: 1,
    TieuDe: 'iPhone 16 Pro Max',
    TieuDePhu: 'Siêu phẩm mới nhất từ Apple',
    MoTa: 'Camera 48MP, chip A18 Pro, màn hình 6.9" ProMotion Dynamic Island',
    GiaHienThi: 'Từ 32.900.000 ₫',
    NutText: 'Mua ngay',
    NutLink: '/products',
    HinhAnh: '/image/slide1.png',
    MauNen: 'linear-gradient(135deg, #0a0a1a 0%, #13131f 50%, #0d2137 100%)',
    TagText: 'HOT',
    TagIcon: 'flame',
    ThuTu: 1,
  },
  {
    MaBanner: 2,
    TieuDe: 'Samsung Galaxy S24 Ultra',
    TieuDePhu: 'Công nghệ AI đỉnh cao',
    MoTa: 'Bút S Pen tích hợp, Galaxy AI, màn hình Dynamic AMOLED 2X 6.8"',
    GiaHienThi: 'Từ 28.900.000 ₫',
    NutText: 'Khám phá',
    NutLink: '/products',
    HinhAnh: '/image/slide2.jpg',
    MauNen: 'linear-gradient(135deg, #0d0d1a 0%, #141430 50%, #1a2060 100%)',
    TagText: 'MỚI',
    TagIcon: 'star',
    ThuTu: 2,
  },
  {
    MaBanner: 3,
    TieuDe: 'Galaxy Z Fold6',
    TieuDePhu: 'Điện thoại gập thế hệ mới',
    MoTa: 'Màn hình gập 7.6", thiết kế mỏng nhẹ, Snapdragon 8 Gen 3',
    GiaHienThi: 'Từ 35.000.000 ₫',
    NutText: 'Xem thêm',
    NutLink: '/products',
    HinhAnh: '/image/slide3.jpg',
    MauNen: 'linear-gradient(135deg, #0f0f20 0%, #1a1040 50%, #0e2040 100%)',
    TagText: 'CAO CẤP',
    TagIcon: 'diamond-outline',
    ThuTu: 3,
  },
];

const SLIDE_DURATION = 5000;

const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_BANNERS);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());
  const currentRef = useRef(0);
  const lengthRef = useRef(FALLBACK_BANNERS.length);

  // Fetch từ API, nếu lỗi dùng fallback sẵn
  useEffect(() => {
    axiosClient.get('/catalog/banners')
      .then((res: any) => {
        const data = res?.data?.banners ?? res?.banners ?? null;
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
          lengthRef.current = data.length;
        }
      })
      .catch(() => { /* dùng FALLBACK_BANNERS đã init trong useState */ })
      .finally(() => setLoading(false));
  }, []);

  // Sync currentRef
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // Slide timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    startRef.current = Date.now();
    setProgress(0);

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
    }, 30);

    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % lengthRef.current);
      startRef.current = Date.now();
    }, SLIDE_DURATION);
  };

  // Khởi động timer khi loading xong
  useEffect(() => {
    if (!loading) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    startTimer();
  };

  const goPrev = () => goTo((current - 1 + banners.length) % banners.length);
  const goNext = () => goTo((current + 1) % banners.length);

  const banner = banners[current];

  if (loading) {
    return (
      <div className="hero-banner hero-skeleton">
        <div className="skeleton-shimmer" />
      </div>
    );
  }

  if (!banner) return null;

  return (
    <section className="hero-banner" aria-label="Banner quảng cáo">
      {/* Progress Bar */}
      <div className="hero-progress-bar">
        <div className="hero-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Slide */}
      <div className="banner-slide" style={{ background: banner.MauNen }}>
        {/* Ambient Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Ảnh nền full width */}
        <img
          src={banner.HinhAnh}
          alt={banner.TieuDe}
          className="banner-bg-img"
          draggable={false}
        />
        {/* Overlay gradient để text dễ đọc */}
        <div className="banner-overlay" />

        {/* Nội dung */}
        <div className="banner-inner container">
          {/* Cột text */}
          <div className="banner-text-col">
            <span className="banner-badge">
              <ion-icon name={banner.TagIcon as any}></ion-icon>
              {banner.TagText}
            </span>

            <h1 className="banner-heading">{banner.TieuDe}</h1>
            <p className="banner-sub">{banner.TieuDePhu}</p>
            <p className="banner-desc">{banner.MoTa}</p>

            <div className="banner-price-row">
              <span className="banner-price">{banner.GiaHienThi}</span>
              <span className="banner-price-label">Giá ưu đãi</span>
            </div>

            <div className="banner-actions">
              <Link to={banner.NutLink} className="btn-primary-banner">
                {banner.NutText}
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </Link>
              <Link to="/products" className="btn-outline-banner">
                Xem tất cả
              </Link>
            </div>

            {/* Slide counter */}
            <div className="banner-counter">
              <span className="counter-current">{String(current + 1).padStart(2, '0')}</span>
              <span className="counter-sep">/</span>
              <span className="counter-total">{String(banners.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="banner-thumbs">
          {banners.map((b, idx) => (
            <button
              key={b.MaBanner}
              className={`thumb-btn${idx === current ? ' active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`Banner ${idx + 1}: ${b.TieuDe}`}
            >
              <span className="thumb-label">{b.TieuDe.split(' ').slice(0, 2).join(' ')}</span>
              <span className="thumb-bar">
                {idx === current && (
                  <span className="thumb-fill" style={{ width: `${progress}%` }} />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="nav-arrow nav-prev" onClick={goPrev} aria-label="Slide trước">
        <ion-icon name="chevron-back"></ion-icon>
      </button>
      <button className="nav-arrow nav-next" onClick={goNext} aria-label="Slide tiếp">
        <ion-icon name="chevron-forward"></ion-icon>
      </button>
    </section>
  );
};

export default HeroBanner;
