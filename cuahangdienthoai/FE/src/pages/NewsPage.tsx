import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import newsApi from '../api/newsApi';
import '../assets/News.css';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res: any = await newsApi.getNewsList();
      setNews(res.news || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải tin tức...</div>;
  }

  const heroNews = news.length > 0 ? news[0] : null;
  const regularNews = news.length > 1 ? news.slice(1) : [];

  return (
    <div className="news-page container">
      <div className="news-header-section">
        <h1>Tin Tức & Thủ Thuật Công Nghệ</h1>
        <p>Cập nhật những thông tin mới nhất về điện thoại, công nghệ, giải trí</p>
      </div>

      {news.length === 0 ? (
        <div className="no-news">
          <ion-icon name="newspaper-outline"></ion-icon>
          <p>Hiện chưa có bài viết nào được xuất bản.</p>
        </div>
      ) : (
        <>
          {/* Bài viết nổi bật (Hero) */}
          {heroNews && (
            <div className="hero-news">
              <div className="hero-image" style={{ backgroundImage: `url(${heroNews.HinhThuNho})` }}></div>
              <div className="hero-overlay">
                <span className="news-badge">Tin Nổi Bật</span>
                <h2>{heroNews.TieuDe}</h2>
                <p>{heroNews.TomTat}</p>
                <div className="hero-meta">
                  <span><ion-icon name="calendar-outline"></ion-icon> {new Date(heroNews.NgayDang).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Lưới bài viết thường */}
          {regularNews.length > 0 && (
            <div className="news-grid">
              {regularNews.map((item) => (
                <div className="news-card" key={item.MaTinTuc}>
                  <div className="news-card-img" style={{ backgroundImage: `url(${item.HinhThuNho})` }}></div>
                  <div className="news-card-content">
                    <span className="news-date"><ion-icon name="time-outline"></ion-icon> {new Date(item.NgayDang).toLocaleDateString('vi-VN')}</span>
                    <h3>{item.TieuDe}</h3>
                    <p>{item.TomTat}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsPage;
