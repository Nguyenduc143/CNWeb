import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { useCart } from '../../context/CartContext';
import catalogApi from '../../api/catalogApi';
import '../../assets/FlashSale.css';

const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' ₫';

const FlashSale: React.FC = () => {
  const { addToCart } = useCart();
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  const [flashSale, setFlashSale] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    catalogApi.getActiveFlashSale()
      .then((res: any) => {
        const data = res.data || res;
        if (data.flashSale) {
          setFlashSale(data.flashSale);
          setItems(data.items || []);
          setEndTime(new Date(data.flashSale.ThoiGianKetThuc));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!endTime) return;
    const tick = () => {
      const diff = endTime.getTime() - Date.now();
      if (diff <= 0) {
        setTime({ h: 0, m: 0, s: 0 });
        return;
      }
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endTime]);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (!flashSale || items.length === 0) return null;

  return (
    <section className="flash-sale-section">
      <div className="container">
        <div className="flash-sale-header">
          <div className="flash-title">
            <img
              src="https://galaxydidong.vn/wp-content/uploads/2024/12/flash-sale-moi-ngay.png"
              alt="Flash Sale"
              className="flash-img"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="flash-label"><ion-icon name="flash"></ion-icon> {flashSale.TenSuKien || 'FLASH SALE'}</span>
          </div>
          <div className="flash-countdown">
            <span className="countdown-label">Kết thúc sau:</span>
            <div className="countdown-boxes">
              <div className="countdown-box">
                <span>{pad(time.h)}</span>
                <small>Giờ</small>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-box">
                <span>{pad(time.m)}</span>
                <small>Phút</small>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-box">
                <span>{pad(time.s)}</span>
                <small>Giây</small>
              </div>
            </div>
          </div>
          <Link to="/flash-sale" className="view-all-btn">Xem tất cả →</Link>
        </div>

        <div className="product-grid">
          {items.map((item) => {
            const discount = Math.round(((item.PriceSell - item.FlashSalePrice) / item.PriceSell) * 100);
            const soldPercent = item.SoLuongGioiHan > 0 ? Math.round((item.DaBan / item.SoLuongGioiHan) * 100) : 0;
            const thumbUrl = item.Image1 || '';

            return (
              <Link to={`/san-pham/${item.Slug}`} key={item.MaChiTiet} className="product-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="product-image-wrap">
                  {discount > 0 && <span className="product-discount">-{discount}%</span>}
                  <img src={thumbUrl} alt={item.ProductName} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{item.ProductName}</h3>
                  <div className="product-pricing">
                    <span className="product-price">{formatPrice(item.FlashSalePrice)}</span>
                    <span className="product-old-price">{formatPrice(item.PriceSell)}</span>
                  </div>
                  {item.SoLuongGioiHan > 0 && (
                    <div className="flash-progress-wrap">
                      <div className="flash-progress-bar">
                        <div className="flash-progress-fill" style={{ width: `${Math.min(soldPercent, 100)}%` }}></div>
                        <span className="flash-progress-text">Đã bán {item.DaBan}/{item.SoLuongGioiHan}</span>
                      </div>
                    </div>
                  )}
                  <div className="product-footer">
                    <button
                      className="btn-cart"
                      disabled={item.SoLuongGioiHan > 0 && item.DaBan >= item.SoLuongGioiHan}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          productId: item.ProductId,
                          productName: item.ProductName,
                          price: item.FlashSalePrice,
                          quantity: 1,
                          image: thumbUrl
                        });
                        message.success(`Đã thêm ${item.ProductName} (Flash Sale) vào giỏ hàng!`);
                      }}
                    >
                      <ion-icon name="flash-outline"></ion-icon> Mua ngay
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
