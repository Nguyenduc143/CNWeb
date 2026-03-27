import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../assets/Cart.css';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-page-empty">
        <ion-icon name="cart-outline"></ion-icon>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Hãy thêm một vài sản phẩm để đi tới bước thanh toán nhé!</p>
        <Link to="/" className="btn-continue-shopping">Quay Lại Cửa Hàng</Link>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="container">
        <h1 className="page-title"><ion-icon name="cart"></ion-icon> Giỏ Hàng ({cart.length} món)</h1>
        
        <div className="cart-layout">
          <div className="cart-main">
            <div className="cart-table-header">
              <div className="col-product">Sản Phẩm</div>
              <div className="col-price">Đơn Giá</div>
              <div className="col-qty">Số Lượng</div>
              <div className="col-total">Thành Tiền</div>
              <div className="col-action"></div>
            </div>
            
            {cart.map(item => (
              <div className="cart-item" key={item.productId}>
                <div className="col-product">
                  <img src={item.image || '/placeholder.png'} alt={item.productName} />
                  <div className="item-name">{item.productName}</div>
                </div>
                <div className="col-price">
                  {item.price.toLocaleString('vi-VN')} ₫
                </div>
                <div className="col-qty">
                  <div className="qty-control">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                    <input type="text" readOnly value={item.quantity} />
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="col-total font-weight-bold" style={{color: '#d32f2f'}}>
                  {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                </div>
                <div className="col-action">
                  <button className="btn-remove" onClick={() => removeFromCart(item.productId)} title="Xóa">
                    <ion-icon name="trash-outline"></ion-icon>
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-actions-bottom">
              <Link to="/" className="btn-outline"><ion-icon name="arrow-back-outline"></ion-icon> Tiếp tục mua sắm</Link>
              <button className="btn-outline text-danger" onClick={clearCart}>Xóa toàn bộ</button>
            </div>
          </div>

          <aside className="cart-sidebar">
            <div className="cart-summary-box">
              <h3>Tạm tính đơn hàng</h3>
              <div className="summary-row">
                <span>Tổng tiền hàng:</span>
                <span>{cartTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <hr />
              <div className="summary-row total-row">
                <span>Tổng thanh toán:</span>
                <span className="final-price">{cartTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              <button className="btn-checkout" onClick={() => navigate('/checkout')}>
                Tiến Hành Thanh Toán
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
