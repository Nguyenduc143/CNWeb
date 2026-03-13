import React from 'react';
import '../../assets/CategoryBar.css';

const categories = [
  { icon: '📱', label: 'Điện Thoại', href: '/dien-thoai' },
  { icon: '🎧', label: 'Tai Nghe', href: '/tai-nghe' },
  { icon: '🔧', label: 'Sửa Chữa', href: '/sua-chua' },
  { icon: '🛠️', label: 'Tiện Ích', href: '/tien-ich' },
  { icon: '📟', label: 'Tablet', href: '/tablet' },
  { icon: '🔋', label: 'Pin & Sạc', href: '/pin-sac' },
  { icon: '🔄', label: 'Thu Cũ', href: '/thu-cu' },
  { icon: 'ℹ️', label: 'Về Chúng Tôi', href: '/gioi-thieu' },
];

const CategoryBar: React.FC = () => {
  return (
    <div className="category-bar">
      <div className="container">
        <div className="category-list">
          {categories.map((cat) => (
            <a key={cat.href} href={cat.href} className="category-item">
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
