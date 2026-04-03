import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import catalogApi from '../api/catalogApi';
import '../assets/ProductListPage.css';

interface ProductListPageProps {
  title: string;
  icon: React.ReactNode;
  brandId?: number;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ title: propTitle, icon, brandId }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || undefined;
  const categoryId = id ? parseInt(id, 10) : undefined;
  
  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState(propTitle);

  useEffect(() => {
    if (keyword) {
      setTitle(`Kết quả tìm kiếm cho: "${keyword}"`);
    } else if (categoryId) {
      catalogApi.getCategories().then((res: any) => {
         const cats = res.data?.categories || res.categories || [];
         const found = cats.find((c:any) => c.CategoryId === categoryId);
         if (found) setTitle(found.Name);
      }).catch(console.error);
    } else {
      setTitle(propTitle);
    }
  }, [categoryId, propTitle, keyword]);

  useEffect(() => {
    catalogApi.getProducts({ brandId, categoryId, keyword, pageSize: 20 })
      .then((res: any) => setProducts(res.data?.products || res.products || []))
      .catch(console.error);
  }, [brandId, categoryId, keyword]);

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
            <p style={{ marginTop: 20 }}>Không tìm thấy sản phẩm nào phù hợp.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
