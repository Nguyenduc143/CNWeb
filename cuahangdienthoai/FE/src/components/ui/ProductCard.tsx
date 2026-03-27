import React from 'react';
import { Product } from '../../data/types';
import { useCart } from '../../context/CartContext';
import '../../assets/ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN') + ' ₫';

// Tính % lợi nhuận so với giá nhập (PriceImport) để hiển thị badge tiết kiệm
const calcDiscount = (sell: number, importP?: number): number => {
  if (!importP || importP <= 0 || sell >= importP) return 0;
  return Math.round(((importP - sell) / importP) * 100);
};

// Sản phẩm mới nếu tạo trong vòng 30 ngày
const isNew = (createdAt: string): boolean => {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 30 * 24 * 60 * 60 * 1000;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const thumbUrl = product.Image1 || product.Images?.[0]?.ImageUrl || '';
  const discount = calcDiscount(product.PriceSell, product.PriceImport);
  const showNew = isNew(product.CreatedAt);

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        {showNew && <span className="product-badge badge-new"><ion-icon name="sparkles"></ion-icon> MỚI</span>}
        {discount > 0 && (
          <span className="product-discount">-{discount}%</span>
        )}
        {product.Stock === 0 && (
          <div className="out-of-stock-overlay">Hết hàng</div>
        )}
        <img src={thumbUrl} alt={product.Name} className="product-img" />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.Name}</h3>

        {(product.RamGB || product.RomGB || product.Color) && (
          <div className="product-specs">
            {product.RamGB  && <span>{product.RamGB}GB RAM</span>}
            {product.RomGB  && <span>{product.RomGB}GB</span>}
            {product.Color  && <span>{product.Color}</span>}
          </div>
        )}

        <div className="product-pricing">
          <span className="product-price">{formatPrice(product.PriceSell)}</span>
          {/* PriceImport hiển thị như giá gốc khi PriceSell < PriceImport */}
          {product.PriceImport && product.PriceSell < product.PriceImport && (
            <span className="product-old-price">{formatPrice(product.PriceImport)}</span>
          )}
        </div>

        <div className="product-footer">
          <span className={`stock-badge ${product.Stock > 0 ? 'in-stock' : 'no-stock'}`}>
            {product.Stock > 0 ? `Còn ${product.Stock}` : 'Hết hàng'}
          </span>
          <button 
            className="btn-cart" 
            disabled={product.Stock === 0}
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                productId: product.ProductId,
                productName: product.Name,
                price: product.PriceSell,
                quantity: 1,
                image: thumbUrl
              });
              alert(`Giỏ hàng đã ghi nhận: ${product.Name}`);
            }}
          >
            <ion-icon name="cart-outline"></ion-icon> Mua
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

