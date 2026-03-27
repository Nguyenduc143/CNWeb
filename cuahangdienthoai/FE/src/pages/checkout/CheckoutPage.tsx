import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import checkoutApi from '../../api/checkoutApi';
import authApi from '../../api/authApi';
import '../../assets/Cart.css';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddr, setSelectedAddr] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    // Kiem tra User Token
    authApi.getProfile()
      .then(() => fetchAddresses())
      .catch(() => {
        alert('Bạn cần đăng nhập để thanh toán');
        navigate('/login');
      });
  }, []);

  const fetchAddresses = async () => {
    try {
      const res: any = await checkoutApi.getAddresses();
      setAddresses(res.addresses || []);
      if (res.addresses && res.addresses.length > 0) {
        setSelectedAddr(res.addresses[0].AddressId);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddr) {
      alert('Vui lòng chọn hoặc thêm địa chỉ giao hàng!');
      return;
    }

    const payload = {
      addressId: selectedAddr,
      subtotal: cartTotal,
      discountAmount: 0,
      total: cartTotal,
      paymentMethod,
      note,
      items: cart.map(c => ({
        ProductId: c.productId,
        Quantity: c.quantity,
        Price: c.price
      }))
    };

    try {
      await checkoutApi.createOrder(payload);
      clearCart();
      alert('Tuyệt vời! Đơn hàng của bạn đã được đặt thành công.');
      window.location.href = '/profile'; // Sang Hồ sơ để coi tiến độ đơn
    } catch (err: any) {
      alert(err.message || 'Lỗi tạo đơn hàng');
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Khởi tạo phiên thanh toán an toàn...</div>;

  return (
    <div className="checkout-page-wrapper">
      <div className="container cart-layout">
        <div className="cart-main checkout-details">
          <h2 className="checkout-heading"><ion-icon name="location-outline"></ion-icon> 1. Thông Tin Giao Hàng</h2>
          
          {addresses.length === 0 ? (
            <div className="checkout-box-empty">
              Bạn chưa có địa chỉ giao hàng. <br/>
              <button 
                className="btn-outline" 
                style={{marginTop: '10px'}} 
                onClick={() => navigate('/profile')}
              >Tạo địa chỉ trong Hồ Sơ</button>
            </div>
          ) : (
            <div className="address-options">
              {addresses.map(a => (
                <label key={a.AddressId} className={`address-radio-card ${selectedAddr === a.AddressId ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="addressSelection" 
                    value={a.AddressId} 
                    checked={selectedAddr === a.AddressId}
                    onChange={(e) => setSelectedAddr(e.target.value)} 
                  />
                  <div className="addr-info">
                    <strong>{a.FullName} ({a.PhoneNumber})</strong>
                    <p>{a.AddressLine}, {a.Ward}, {a.District}, {a.Province}</p>
                    {a.Note && <span>Ghi chú: {a.Note}</span>}
                  </div>
                </label>
              ))}
            </div>
          )}

          <h2 className="checkout-heading mt-30"><ion-icon name="card-outline"></ion-icon> 2. Phương Thức Thanh Toán</h2>
          <div className="payment-options">
            <label className="payment-radio">
              <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={e => setPaymentMethod(e.target.value)} />
              <span>Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label className="payment-radio">
              <input type="radio" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={e => setPaymentMethod(e.target.value)} />
              <span>Chuyển khoản / VNPAY</span>
            </label>
          </div>

          <h2 className="checkout-heading mt-30"><ion-icon name="document-text-outline"></ion-icon> Ghi chú cho Đơn hàng</h2>
          <textarea 
            className="checkout-textarea" 
            placeholder="Ví dụ: Giao giờ hành chính..."
            value={note}
            onChange={e => setNote(e.target.value)}
          ></textarea>

        </div>

        <aside className="cart-sidebar">
          <div className="cart-summary-box">
            <h3>Tóm tắt đơn hàng</h3>
            <div className="checkout-items-list">
              {cart.map(item => (
                <div className="mini-item" key={item.productId}>
                  <img src={item.image} alt={item.productName} />
                  <div className="mini-item-info">
                    <span>{item.productName}</span>
                    <small>SL: {item.quantity}</small>
                  </div>
                  <div className="mini-item-price">
                    {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="summary-row total-row">
              <span>Cần thanh toán:</span>
              <span className="final-price">{cartTotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            
            <button className="btn-place-order" onClick={handlePlaceOrder}>
              ĐẶT HÀNG NGAY
            </button>
            <p className="checkout-policy">Bằng việc Đặt hàng, bạn đồng ý với các <a>Điều khoản quy định</a> của chúng tôi.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
