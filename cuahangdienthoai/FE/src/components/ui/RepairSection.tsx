import React, { useState, useEffect } from 'react';
import catalogApi from '../../api/catalogApi';
import '../../assets/RepairSection.css';

const LOCATIONS = ['94 Thái Hà', '398 Cầu Giấy'];

const RepairSection: React.FC = () => {
  const [repairProducts, setRepairProducts] = useState<any[]>([]);

  useEffect(() => {
    catalogApi.getProducts({ categoryId: 7, pageSize: 4 })
      .then((res: any) => setRepairProducts(res.data?.products || res.products || []))
      .catch(console.error);
  }, []);

  return (
    <section className="repair-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-icon"><ion-icon name="construct-outline"></ion-icon></span>
            <h2 className="section-title">DỊCH VỤ SỬA CHỮA</h2>
          </div>
          <a href="/sua-chua" className="view-all-btn">Xem tất cả <ion-icon name="arrow-forward"></ion-icon></a>
        </div>

        <div className="repair-grid">
          {repairProducts.map((s) => (
            <div key={s.ProductId} className="repair-card">
              <div className="repair-img-wrap">
                <img src={s.Image1 || s.Images?.[0]?.ImageUrl || ''} alt={s.Name} />
              </div>
              <div className="repair-info">
                <h3 className="repair-name">{s.Name}</h3>
                <div className="repair-price-row">
                  <span className="repair-price">{s.PriceSell.toLocaleString('vi-VN')} ₫</span>
                  {s.PriceImport && s.PriceSell < s.PriceImport && (
                    <span className="repair-old-price">{s.PriceImport.toLocaleString('vi-VN')} ₫</span>
                  )}
                </div>
                <div className="repair-locations">
                  <span><ion-icon name="location-outline"></ion-icon> Có sẵn tại:</span>
                  {LOCATIONS.map((loc) => (
                    <span key={loc} className="location-tag">{loc}</span>
                  ))}
                </div>
                <button className="repair-btn">Đặt lịch ngay</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RepairSection;

