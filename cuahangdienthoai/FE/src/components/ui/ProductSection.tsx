import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../data/types';
import '../../assets/ProductSection.css';

interface ProductSectionProps {
  title: string;
  icon: React.ReactNode;
  products: Product[];
  viewAllLink?: string;
  subCategories?: { label: string; href: string }[];
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  icon,
  products,
  viewAllLink = '#',
  subCategories,
}) => {
  return (
    <section className="product-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-icon">{icon}</span>
            <h2 className="section-title">{title}</h2>
          </div>
          {subCategories && (
            <div className="section-sub-cats">
              {subCategories.map((sc) => (
                <a key={sc.href} href={sc.href} className="sub-cat-link">
                  {sc.label}
                </a>
              ))}
            </div>
          )}
          <a href={viewAllLink} className="view-all-btn">Xem tất cả →</a>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.ProductId} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
