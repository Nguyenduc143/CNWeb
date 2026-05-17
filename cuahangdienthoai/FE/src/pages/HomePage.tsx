import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/ui/HeroBanner';
import FlashSale from '../components/ui/FlashSale';
import ProductSection from '../components/ui/ProductSection';
import catalogApi from '../api/catalogApi';
import { ICON_MAP } from './admin/BrandSectionManager';
import '../assets/HomePage.css';

const HomePage: React.FC = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [productMap, setProductMap] = useState<Record<number, any[]>>({});

  useEffect(() => {
    // Lấy danh sách dải từ DB (Admin quản lý, không cần sửa code)
    catalogApi.getDaiSanPham()
      .then(async (res: any) => {
        const list = res.data?.daiSanPham || res.daiSanPham || [];
        setSections(list);

        // Fetch song song tất cả sản phẩm cho từng dải
        const fetches = list.map((s: any) =>
          catalogApi.getProducts({ brandId: s.MaThuongHieu, pageSize: s.SoSanPhamHienThi })
            .then((r: any) => ({
              brandId: s.MaThuongHieu,
              products: r.data?.products || r.products || [],
            }))
        );

        const results = await Promise.all(fetches);
        const map: Record<number, any[]> = {};
        results.forEach(({ brandId, products }: any) => { map[brandId] = products; });
        setProductMap(map);
      })
      .catch(console.error);
  }, []);

  return (
    <main>
      <HeroBanner />

      <FlashSale />

      {/* Render động từ DB - Admin quản lý hoàn toàn */}
      {sections.map((section: any) => (
        <ProductSection
          key={section.MaDai}
          title={section.TieuDe}
          icon={ICON_MAP[section.Icon]}
          products={productMap[section.MaThuongHieu] || []}
          viewAllLink={section.DuongDanXemTat}
          subCategories={[]}
        />
      ))}

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
                { icon: <ion-icon name="checkmark-circle-outline"></ion-icon>, title: 'Sản phẩm chính hãng', desc: '100% hàng chính hãng, có tem bảo hành' },
                { icon: <ion-icon name="cash-outline"></ion-icon>, title: 'Giá cả cạnh tranh', desc: 'Cam kết giá tốt nhất thị trường' },
                { icon: <ion-icon name="car-outline"></ion-icon>, title: 'Miễn phí vận chuyển', desc: 'Ship toàn quốc, nhận hàng nhanh' },
                { icon: <ion-icon name="build-outline"></ion-icon>, title: 'Sửa chữa chuyên nghiệp', desc: 'Kỹ thuật viên giàu kinh nghiệm' },
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
