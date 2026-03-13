import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../data/types';
import '../assets/ProductListPage.css';

interface ProductListPageProps {
  title: string;
  icon: string;
  products: Product[];
}

const ProductListPage: React.FC<ProductListPageProps> = ({ title, icon, products }) => {
  return (
    <div className="product-list-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> / </span>
          <span>{title}</span>
        </div>

        <h1 className="page-title">{icon} {title}</h1>

        <div className="page-grid">
          {products.map((p) => (
            <ProductCard key={p.ProductId} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

