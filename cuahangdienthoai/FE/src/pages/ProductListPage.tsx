import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import catalogApi from '../api/catalogApi';
import '../assets/ProductListPage.css';

interface ProductListPageProps {
  title: string;
  icon: string;
  brandId: number;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ title, icon, brandId }) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    catalogApi.getProducts({ brandId, pageSize: 20 })
      .then((res: any) => setProducts(res.data?.products || res.products || []))
      .catch(console.error);
  }, [brandId]);

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
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.ProductId} product={p} />
            ))
          ) : (
            <p style={{ marginTop: 20 }}>Đang cập nhật sản phẩm cho hãng này...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
