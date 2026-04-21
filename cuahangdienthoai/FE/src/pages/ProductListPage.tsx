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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const keyword = searchParams.get('keyword') || undefined;
  const categoryId = id ? parseInt(id, 10) : undefined;
  
  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState(propTitle);

  // States cho Bộ Lọc và Phân Trang
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 12;

  useEffect(() => {
    // Reset filters khi thay danh mục/thương hiệu/từ khóa
    setPage(1);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('NEWEST');
  }, [brandId, categoryId, keyword]);

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
    fetchProducts();
  }, [brandId, categoryId, keyword, page, sortBy, minPrice, maxPrice]);

  const fetchProducts = () => {
    const params: any = { brandId, categoryId, keyword, page, pageSize };
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sortBy) params.sortBy = sortBy;

    catalogApi.getProducts(params)
      .then((res: any) => {
        const data = res.data || res;
        setProducts(data.products || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      })
      .catch(console.error);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('NEWEST');
    setPage(1);
  };

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

        {/* Thanh Công Cụ Bộ Lọc */}
        <div className="filter-bar">
          <div className="filter-group">
            <label>Khoảng Giá:</label>
            <input 
              type="number" 
              placeholder="Tối thiểu" 
              value={minPrice} 
              onChange={e => setMinPrice(e.target.value)}
              className="filter-input input-price"
            />
            <span className="price-separator">-</span>
            <input 
              type="number" 
              placeholder="Tối đa" 
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value)}
              className="filter-input input-price"
            />
          </div>

          <div className="filter-group">
            <label>Sắp xếp theo:</label>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="filter-input select-sort"
            >
              <option value="NEWEST">Mới Nhất</option>
              <option value="PRICE_ASC">Giá: Thấp đến Cao</option>
              <option value="PRICE_DESC">Giá: Cao đến Thấp</option>
            </select>
          </div>

          {(minPrice || maxPrice || sortBy !== 'NEWEST') && (
            <button onClick={clearFilters} className="btn-clear-filters">
              Xóa Bộ Lọc
            </button>
          )}
        </div>

        {/* Lưới Sản Phẩm */}
        <div className="page-grid">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.ProductId} product={p} />
            ))
          ) : (
            <div className="no-products-found">
              <ion-icon name="sad-outline"></ion-icon>
              <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
            </div>
          )}
        </div>

        {/* Phân Trang */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn-page" 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
            >
              <ion-icon name="chevron-back-outline"></ion-icon> Trước
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button 
                  key={p} 
                  className={`btn-page-num ${page === p ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button 
              className="btn-page" 
              disabled={page === totalPages} 
              onClick={() => setPage(page + 1)}
            >
              Tiếp <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
