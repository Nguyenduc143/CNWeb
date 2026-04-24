import React from 'react';
import '../assets/AboutPage.css';



const milestones = [
  { year: '2014', event: 'Thành lập cửa hàng đầu tiên tại 94 Thái Hà, Hà Nội với 3 nhân viên.' },
  { year: '2017', event: 'Mở rộng chi nhánh thứ hai tại 398 Cầu Giấy, phục vụ hơn 10.000 khách hàng.' },
  { year: '2020', event: 'Ra mắt website thương mại điện tử, bán hàng trực tuyến toàn quốc.' },
  { year: '2023', event: 'Đạt mốc 50.000 khách hàng trung thành, Top 10 cửa hàng điện thoại uy tín Hà Nội.' },
  { year: '2024', event: 'Nâng cấp hệ thống quản lý, cải tiến trải nghiệm mua sắm online và tại quầy.' },
];

const commitments = [
  { icon: 'shield-checkmark-outline', title: '100% Hàng Chính Hãng', desc: 'Tất cả sản phẩm đều có tem bảo hành chính hãng từ nhà sản xuất, đảm bảo nguồn gốc rõ ràng.' },
  { icon: 'cash-outline', title: 'Giá Tốt Nhất Thị Trường', desc: 'Cam kết hoàn tiền nếu bạn tìm được giá thấp hơn tại các cửa hàng uy tín khác.' },
  { icon: 'refresh-outline', title: 'Đổi Trả Trong 30 Ngày', desc: 'Chính sách đổi trả linh hoạt trong vòng 30 ngày nếu sản phẩm có lỗi từ nhà sản xuất.' },
  { icon: 'headset-outline', title: 'Hỗ Trợ 24/7', desc: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc qua hotline và chat.' },
  { icon: 'car-outline', title: 'Miễn Phí Vận Chuyển', desc: 'Giao hàng miễn phí toàn quốc cho đơn hàng từ 500.000đ, nhận hàng trong 1–3 ngày.' },
  { icon: 'construct-outline', title: 'Bảo Hành Chính Hãng', desc: 'Chính sách bảo hành 12 tháng chính hãng tại 2 chi nhánh, hỗ trợ gửi bưu kiện toàn quốc.' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <div className="container about-hero-content">
          <span className="about-hero-badge">
            <ion-icon name="storefront-outline"></ion-icon> Thành lập năm 2014
          </span>
          <h1>Về Cửa Hàng Di Động</h1>
          <p>
            Hơn 10 năm đồng hành cùng người dùng Việt Nam, chúng tôi tự hào là
            địa điểm tin cậy để bạn sở hữu những chiếc điện thoại chính hãng với
            giá tốt nhất.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="about-stats-bar">
        <div className="container">
          <div className="stats-grid">
            {[
              { icon: 'calendar-outline', value: '10+', label: 'Năm kinh nghiệm' },
              { icon: 'people-outline', value: '50.000+', label: 'Khách hàng tin dùng' },
              { icon: 'storefront-outline', value: '2', label: 'Chi nhánh tại Hà Nội' },
              { icon: 'phone-portrait-outline', value: '500+', label: 'Mẫu sản phẩm' },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <span className="stat-icon"><ion-icon name={s.icon}></ion-icon></span>
                <strong className="stat-value">{s.value}</strong>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SỨ MỆNH ── */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text">
              <span className="section-tag">Sứ mệnh của chúng tôi</span>
              <h2>Kết Nối Công Nghệ – Nâng Tầm Cuộc Sống</h2>
              <p>
                Chúng tôi tin rằng mọi người đều xứng đáng được sử dụng những
                sản phẩm công nghệ tốt nhất mà không cần lo lắng về chất lượng
                hay giá cả. Đó là lý do chúng tôi nỗ lực mỗi ngày để mang đến
                trải nghiệm mua sắm minh bạch, tận tâm và đáng tin cậy.
              </p>
              <p>
                Với đội ngũ tư vấn chuyên nghiệp và hệ thống sau bán hàng bài
                bản, chúng tôi cam kết đồng hành cùng bạn suốt hành trình sử
                dụng sản phẩm.
              </p>
              <div className="mission-values">
                {['Trung thực', 'Chất lượng', 'Tận tâm', 'Đổi mới'].map((v) => (
                  <span key={v} className="value-pill">
                    <ion-icon name="checkmark-circle"></ion-icon> {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="mission-visual">
              <div className="visual-card v1">
                <ion-icon name="phone-portrait-outline"></ion-icon>
                <span>Điện thoại chính hãng</span>
              </div>
              <div className="visual-card v2">
                <ion-icon name="shield-checkmark-outline"></ion-icon>
                <span>Bảo hành uy tín</span>
              </div>
              <div className="visual-card v3">
                <ion-icon name="happy-outline"></ion-icon>
                <span>Khách hàng hài lòng</span>
              </div>
              <div className="visual-card v4">
                <ion-icon name="star-outline"></ion-icon>
                <span>Top cửa hàng Hà Nội</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAM KẾT ── */}
      <section className="about-commitments">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Cam kết của chúng tôi</span>
            <h2>Tại Sao Chọn Chúng Tôi?</h2>
          </div>
          <div className="commitments-grid">
            {commitments.map((c) => (
              <div key={c.title} className="commitment-card">
                <span className="commitment-icon">
                  <ion-icon name={c.icon}></ion-icon>
                </span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HÀNH TRÌNH ── */}
      <section className="about-timeline">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Hành trình phát triển</span>
            <h2>Những Cột Mốc Đáng Nhớ</h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={m.year} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <span className="timeline-year">{m.year}</span>
                  <p>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── LIÊN HỆ / CHI NHÁNH ── */}
      <section className="about-branches">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Tìm chúng tôi</span>
            <h2>Hệ Thống Chi Nhánh</h2>
          </div>
          <div className="branches-grid">
            <div className="branch-card">
              <div className="branch-icon"><ion-icon name="location-outline"></ion-icon></div>
              <div className="branch-info">
                <h3>Chi Nhánh 1 – Thái Hà</h3>
                <p><ion-icon name="map-outline"></ion-icon> 94 Thái Hà, Đống Đa, Hà Nội</p>
                <p><ion-icon name="time-outline"></ion-icon> Mở cửa: 8:00 – 21:00 hàng ngày</p>
                <p><ion-icon name="call-outline"></ion-icon> <a href="tel:18006868">1800 6868</a></p>
              </div>
            </div>
            <div className="branch-card">
              <div className="branch-icon"><ion-icon name="location-outline"></ion-icon></div>
              <div className="branch-info">
                <h3>Chi Nhánh 2 – Cầu Giấy</h3>
                <p><ion-icon name="map-outline"></ion-icon> 398 Cầu Giấy, Cầu Giấy, Hà Nội</p>
                <p><ion-icon name="time-outline"></ion-icon> Mở cửa: 8:00 – 21:00 hàng ngày</p>
                <p><ion-icon name="call-outline"></ion-icon> <a href="tel:18006868">1800 6868</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-box">
            <ion-icon name="storefront-outline"></ion-icon>
            <h2>Sẵn Sàng Mua Sắm?</h2>
            <p>Khám phá hàng trăm sản phẩm điện thoại chính hãng với giá tốt nhất.</p>
            <a href="/" className="cta-btn">
              <ion-icon name="arrow-forward-outline"></ion-icon> Xem Sản Phẩm Ngay
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
