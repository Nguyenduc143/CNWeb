import React from 'react';
import '../../assets/CategoryBar.css';

const categories = [
  { icon: 'phone-portrait-outline', label: 'Điện Thoại', href: '/dien-thoai' },
  { icon: 'headset-outline', label: 'Tai Nghe', href: '/tai-nghe' },
  { icon: 'construct-outline', label: 'Sửa Chữa', href: '/sua-chua' },
  { icon: 'build-outline', label: 'Tiện Ích', href: '/tien-ich' },
  { icon: 'tablet-portrait-outline', label: 'Tablet', href: '/tablet' },
  { icon: 'battery-charging-outline', label: 'Pin & Sạc', href: '/pin-sac' },
  { icon: 'refresh-outline', label: 'Thu Cũ', href: '/thu-cu' },
  { icon: 'information-circle-outline', label: 'Về Chúng Tôi', href: '/gioi-thieu' },
];

const CategoryBar: React.FC = () => {
  return (
    <div className="category-bar">
      <div className="container">
        <div className="category-list">
          {categories.map((cat) => (
            <a key={cat.href} href={cat.href} className="category-item">
              <span className="cat-icon"><ion-icon name={cat.icon}></ion-icon></span>
              <span className="cat-label">{cat.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
