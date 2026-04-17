import React from 'react';
import '../../assets/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Promo bar */}
      <div className="footer-promo">
        <div className="container">
          <div className="promo-list">
            <div className="promo-item">
              <span className="promo-icon"><ion-icon name="bus-outline"></ion-icon></span>
              <div>
                <strong>Miễn phí vận chuyển</strong>
                <p>Toàn quốc</p>
              </div>
            </div>
            <div className="promo-item">
              <span className="promo-icon"><ion-icon name="shield-checkmark-outline"></ion-icon></span>
              <div>
                <strong>Bảo hành chính hãng</strong>
                <p>12 tháng</p>
              </div>
            </div>
            <div className="promo-item">
              <span className="promo-icon"><ion-icon name="card-outline"></ion-icon></span>
              <div>
                <strong>Trả góp 0%</strong>
                <p>Duyệt trong 5 phút</p>
              </div>
            </div>
            <div className="promo-item">
              <span className="promo-icon"><ion-icon name="refresh-outline"></ion-icon></span>
              <div>
                <strong>Đổi trả 7 ngày</strong>
                <p>Không cần lý do</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* About */}
            <div className="footer-col footer-about">
              <h3 className="footer-logo-text"><ion-icon name="phone-portrait-outline"></ion-icon> CỬA HÀNG DI ĐỘNG</h3>
              <p>
                Chuyên cung cấp điện thoại, phụ kiện chính hãng và dịch vụ sửa chữa chuyên nghiệp. 
                Hơn 10 năm phục vụ hàng chục nghìn khách hàng.
              </p>
              <div className="footer-contact">
                <p><ion-icon name="call-outline"></ion-icon> Hotline: <strong>0967688908</strong></p>
                <p><ion-icon name="location-outline"></ion-icon> Mỹ Hào, Hưng Yên</p>
                <p><ion-icon name="location-outline"></ion-icon> Yên Mỹ, Hưng Yên</p>
                <p><ion-icon name="mail-outline"></ion-icon> nguyenduc9adt19@gmail.com</p>
              </div>
            </div>

            {/* Products */}
            <div className="footer-col">
              <h4 className="footer-heading">Sản Phẩm</h4>
              <ul className="footer-links">
                <li><a href="/iphone">iPhone</a></li>
                <li><a href="/samsung">Samsung Galaxy</a></li>
                <li><a href="/oppo">Oppo</a></li>
                <li><a href="/xiaomi">Xiaomi</a></li>
                <li><a href="/tablet">Tablet</a></li>
                <li><a href="/phu-kien">Phụ kiện</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-col">
              <h4 className="footer-heading">Dịch Vụ</h4>
              <ul className="footer-links">
                <li><a href="/sua-chua">Sửa chữa điện thoại</a></li>
                <li><a href="/thay-man-hinh">Thay màn hình</a></li>
                <li><a href="/thay-pin">Thay pin</a></li>
                <li><a href="/thu-cu">Thu mua máy cũ</a></li>
                <li><a href="/tra-gop">Trả góp 0%</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-col">
              <h4 className="footer-heading">Hỗ Trợ</h4>
              <ul className="footer-links">
                <li><a href="/chinh-sach-bao-hanh">Chính sách bảo hành</a></li>
                <li><a href="/chinh-sach-doi-tra">Chính sách đổi trả</a></li>
                <li><a href="/chinh-sach-bao-mat">Chính sách bảo mật</a></li>
                <li><a href="/huong-dan-mua-hang">Hướng dẫn mua hàng</a></li>
                <li><a href="/lien-he">Liên hệ</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 Cửa Hàng Di Động. Tất cả quyền được bảo lưu.</p>
          <div className="footer-payments">
            <span className="payment-icon"><ion-icon name="card-outline"></ion-icon></span>
            <span className="payment-icon"><ion-icon name="business-outline"></ion-icon></span>
            <span className="payment-icon"><ion-icon name="phone-portrait-outline"></ion-icon></span>
            <span className="payment-label">Thanh toán an toàn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
