import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import catalogApi from '../../api/catalogApi';
import '../../assets/FlashSale.css';

const getTimeLeft = () => {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 0);
  const diff = end.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
};

const FlashSale: React.FC = () => {
  const [time, setTime] = useState(getTimeLeft());
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000);
    
    // Fetch 4 sản phẩm bất kỳ làm hiển thị giả lập Flash Sale
    catalogApi.getProducts({ pageSize: 4 })
      .then((res: any) => setFlashSaleProducts(res.data?.products || res.products || []))
      .catch(console.error);

    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

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
            <span className="flash-label"><ion-icon name="flash"></ion-icon> FLASH SALE</span>
            <span className="flash-sub">Siêu Sale Hôm Nay</span>
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
          <a href="/flash-sale" className="view-all-btn">Xem tất cả →</a>
        </div>

        <div className="product-grid">
          {flashSaleProducts.map((p) => (
            <ProductCard key={p.ProductId} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
