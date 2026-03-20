import React from 'react';
import HeroBanner from '../components/ui/HeroBanner';
import FlashSale from '../components/ui/FlashSale';
import ProductSection from '../components/ui/ProductSection';
import RepairSection from '../components/ui/RepairSection';
import { iphoneProducts, samsungProducts } from '../data/products';
import '../assets/HomePage.css';

const HomePage: React.FC = () => {
  return (
    <main>
      <HeroBanner />

      <FlashSale />

      <ProductSection
        title="iPhone"
        icon="🍎"
        products={iphoneProducts}
        viewAllLink="/iphone"
        subCategories={[
          { label: 'iPhone 16 Series', href: '/iphone-16' },
          { label: 'iPhone 15 Series', href: '/iphone-15' },
          { label: 'iPhone 14 Series', href: '/iphone-14' },
          { label: 'iPhone 13 Series', href: '/iphone-13' },
        ]}
      />

      <ProductSection
        title="Samsung Galaxy"
        icon="📟"
        products={samsungProducts}
        viewAllLink="/samsung"
        subCategories={[
          { label: 'Galaxy S Series', href: '/samsung-s' },
          { label: 'Galaxy Z Fold/Flip', href: '/samsung-z' },
          { label: 'Galaxy Note', href: '/samsung-note' },
        ]}
      />

      <RepairSection />

      {/* About section */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Về Cửa Hàng Di Động</h2>
              <p>
                Trải qua hơn 10 năm kinh doanh sản phẩm điện tử, cụ thể là ngành Điện thoại và sản phẩm dịch vụ đi kèm.
                Chúng tôi đã phục vụ hàng chục nghìn khách hàng, đến từ mọi vùng miền trên cả nước.
              </p>
              <p>
                Chúng tôi cam kết mang đến sản phẩm chính hãng, giá cả cạnh tranh và dịch vụ khách hàng tận tâm nhất.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <strong>10+</strong>
                  <span>Năm kinh nghiệm</span>
                </div>
                <div className="stat-item">
                  <strong>50.000+</strong>
                  <span>Khách hàng</span>
                </div>
                <div className="stat-item">
                  <strong>2</strong>
                  <span>Chi nhánh</span>
                </div>
              </div>
            </div>
            <div className="about-features">
              {[
                { icon: '✅', title: 'Sản phẩm chính hãng', desc: '100% hàng chính hãng, có tem bảo hành' },
                { icon: '💰', title: 'Giá cả cạnh tranh', desc: 'Cam kết giá tốt nhất thị trường' },
                { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Ship toàn quốc, nhận hàng nhanh' },
                { icon: '🔧', title: 'Sửa chữa chuyên nghiệp', desc: 'Kỹ thuật viên giàu kinh nghiệm' },
              ].map((f) => (
                <div key={f.title} className="feature-card">
                  <span className="feature-icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
