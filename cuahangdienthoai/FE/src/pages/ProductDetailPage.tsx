import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import catalogApi from '../api/catalogApi';
import { useCart } from '../context/CartContext';
import '../assets/ProductDetailPage.css';
import { Product } from '../data/types';

const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' ₫';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    catalogApi.getProductBySlug(slug)
      .then((res: any) => {
        // Fallback for different API response shapes
        setProduct(res.data?.product || res.data || res.product || res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="loading-container">Đang tải thông tin sản phẩm...</div>;
  if (!product) return <div className="error-container">Không tìm thấy sản phẩm!</div>;

  const thumbUrl = product.Image1 || product.Images?.[0]?.ImageUrl || '';

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart({
      productId: product.ProductId,
      productName: product.Name,
      price: product.PriceSell,
      quantity: 1,
      image: thumbUrl
    });
    alert(`Đã thêm ${product.Name} vào giỏ hàng!`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart();
    navigate('/cart');
  };

  const discount = (product.PriceImport && product.PriceSell < product.PriceImport)
    ? Math.round(((product.PriceImport - product.PriceSell) / product.PriceImport) * 100)
    : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          {/* Cột Hình ảnh */}
          <div className="product-detail-images">
             <div className="main-image">
               <img src={thumbUrl} alt={product.Name} />
               {discount > 0 && <span className="detail-discount-badge">-{discount}%</span>}
             </div>
          </div>
          
          {/* Cột Thông tin */}
          <div className="product-detail-info">
             <h1 className="detail-title">{product.Name}</h1>
             
             <div className="detail-price-wrap">
               <span className="current-price">{formatPrice(product.PriceSell)}</span>
               {discount > 0 && product.PriceImport && (
                 <span className="old-price">{formatPrice(product.PriceImport)}</span>
               )}
             </div>

             <div className="detail-specs">
                <p><strong>Thương hiệu:</strong> {product.BrandName || 'Đang cập nhật'}</p>
                <p><strong>Danh mục:</strong> {product.CategoryName || 'Đang cập nhật'}</p>
                <p><strong>Kho:</strong> {product.Stock > 0 ? `Còn ${product.Stock} sản phẩm` : 'Hết hàng'}</p>
             </div>

             {/* Biến thể */}
             {(product.RamGB || product.RomGB || product.Color) && (
             <div className="detail-variants">
                <h3>Cấu hình phần cứng</h3>
                <div className="variant-badges">
                  {product.RamGB && <span className="variant-badge">RAM {product.RamGB}GB</span>}
                  {product.RomGB && <span className="variant-badge">ROM {product.RomGB}GB</span>}
                  {product.Color && <span className="variant-badge">Màu: {product.Color}</span>}
                </div>
             </div>
             )}

             {/* Nút thao tác */}
             <div className="detail-actions">
                <button 
                  className="btn-add-to-cart" 
                  disabled={product.Stock === 0}
                  onClick={handleAddToCart}
                >
                  <ion-icon name="cart-outline"></ion-icon> Thêm vào giỏ
                </button>
                <button 
                  className="btn-buy-now" 
                  disabled={product.Stock === 0}
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </button>
             </div>
          </div>
        </div>

        {/* Bài viết / Mô tả */}
        <div className="product-description-wrap">
           <h2>Đặc điểm nổi bật</h2>
           <div 
             className="product-description-content"
             dangerouslySetInnerHTML={{ __html: product.Description || 'Đang cập nhật mô tả...' }}
           />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
