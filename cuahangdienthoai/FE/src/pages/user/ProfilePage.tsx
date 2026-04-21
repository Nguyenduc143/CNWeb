import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import checkoutApi from '../../api/checkoutApi';
import '../../assets/Profile.css';

const ProfilePage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const navigate = useNavigate();

  // Address State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrForm, setAddrForm] = useState({
    fullName: '', phone: '', addressLine: '', ward: '', district: '', province: '', note: ''
  });

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);

  // Security State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'address') {
      loadAddresses();
    } else if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const res: any = await authApi.getProfile();
      const user = res.user;
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setEmail(user.username || '');
      setRole(user.role || 'Customer');
      setLoading(false);
    } catch (error) {
      navigate('/login');
    }
  };

  const loadAddresses = async () => {
    try {
      const res: any = await checkoutApi.getAddresses();
      setAddresses(res.addresses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOrders = async () => {
    try {
      const res: any = await checkoutApi.getOrderHistory();
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không? Việc hủy không thể hoàn tác!')) {
      return;
    }
    try {
      await checkoutApi.cancelOrder(orderId);
      alert('Hủy đơn hàng thành công!');
      loadOrders(); // Refresh order list
    } catch (err: any) {
      alert(err.message || 'Lỗi khi hủy đơn hàng');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateProfile({ fullName, phone });
      alert('Cập nhật thông tin thành công!');
    } catch (error: any) {
      alert(error.message || 'Lỗi cập nhật');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await checkoutApi.addAddress(addrForm);
      setShowAddressModal(false);
      setAddrForm({ fullName: '', phone: '', addressLine: '', ward: '', district: '', province: '', note: '' });
      loadAddresses(); // Re-fetch
      alert('Đã thêm địa chỉ thành công');
    } catch (err: any) {
      alert(err.message || 'Lỗi thêm địa chỉ');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        await checkoutApi.deleteAddress(id);
        loadAddresses();
      } catch (err) {
        alert('Lỗi xóa địa chỉ');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Nhập lại mật khẩu mới không khớp!');
      return;
    }
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      alert('Đổi mật khẩu bảo mật thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      alert(err.message || 'Lỗi đổi mật khẩu');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Đang tải...</div>;

  return (
    <div className="profile-page-wrapper">
      <div className="container profile-layout">
        
        {/* Thanh Menu Trái (Sidebar) */}
        <aside className="profile-sidebar">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              <ion-icon name="person-outline"></ion-icon>
            </div>
            <div className="sidebar-user-info">
              <p className="greeting">Xin chào,</p>
              <p className="name">{fullName || email.split('@')[0]}</p>
            </div>
          </div>
          
          <ul className="sidebar-menu">
            <li>
              <button 
                className={`sidebar-link ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                <ion-icon name="person-circle-outline"></ion-icon>
                <span>Hồ Sơ Của Tôi</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeTab === 'address' ? 'active' : ''}`}
                onClick={() => setActiveTab('address')}
              >
                <ion-icon name="location-outline"></ion-icon>
                <span>Sổ Địa Chỉ</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <ion-icon name="receipt-outline"></ion-icon>
                <span>Đơn Mua Của Bạn</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-link ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <ion-icon name="lock-closed-outline"></ion-icon>
                <span>Bảo Mật</span>
              </button>
            </li>
            {role === 'Admin' && (
              <li>
                <button 
                  className="sidebar-link"
                  onClick={() => navigate('/admin')}
                  style={{ color: '#288ad6', fontWeight: 'bold' }}
                >
                  <ion-icon name="shield-checkmark-outline" style={{ color: '#288ad6' }}></ion-icon>
                  <span>Bảng Điều Khiển Admin</span>
                </button>
              </li>
            )}
            <li style={{ borderTop: '1px solid #f0f0f0', marginTop: '10px', paddingTop: '10px' }}>
              <button className="sidebar-link" onClick={handleLogout} style={{color: '#d32f2f'}}>
                <ion-icon name="log-out-outline" style={{color: '#d32f2f'}}></ion-icon>
                <span>Đăng Xuất</span>
              </button>
            </li>
          </ul>
        </aside>

        {/* Khung Nội Dung Chính (Main Window) */}
        <main className="profile-main">
          {activeTab === 'account' && (
            <>
              <div className="profile-main-header">
                <h2>Hồ Sơ Của Tôi</h2>
                <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>

              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group-row">
                  <label className="form-label">Tên Đăng Nhập</label>
                  <input type="text" value={email} disabled className="form-input" />
                </div>
                <div className="form-group-row">
                  <label className="form-label">Họ và Tên</label>
                  <input 
                    type="text" placeholder="Nguyễn Văn A..." value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} required className="form-input" />
                </div>
                <div className="form-group-row">
                  <label className="form-label">Số Điện Thoại</label>
                  <input 
                    type="tel" placeholder="Ví dụ: 0912345678" value={phone} 
                    onChange={(e) => setPhone(e.target.value)} required className="form-input" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Lưu Thay Đổi</button>
                </div>
              </form>
            </>
          )}

          {activeTab === 'address' && (
            <>
              <div className="address-header">
                <div>
                  <h2>Địa Chỉ Của Tôi</h2>
                  <p style={{margin: '5px 0 0 0', color: '#555', fontSize: '14px'}}>Quản lý địa chỉ giao hàng nhận hàng của bạn</p>
                </div>
                <button className="btn-add-address" onClick={() => setShowAddressModal(true)}>
                  <ion-icon name="add-outline"></ion-icon> Thêm Địa Chỉ Mới
                </button>
              </div>

              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9e9e9e', padding: '50px 0' }}>
                  <ion-icon name="map-outline" style={{ fontSize: '48px', color: '#e0e0e0' }}></ion-icon>
                  <p>Bạn chưa thêm địa chỉ nào vào Sổ Địa Chỉ.</p>
                </div>
              ) : (
                <div className="address-list">
                  {addresses.map((addr) => (
                    <div className="address-card" key={addr.AddressId}>
                      <div className="name-phone">{addr.FullName} | {addr.PhoneNumber}</div>
                      <div className="address-details">
                        {addr.AddressLine}<br />
                        {addr.Ward}, {addr.District}, {addr.Province}
                      </div>
                      {addr.Note && <div style={{fontSize: '13px', color: '#888', fontStyle: 'italic', marginBottom: '10px'}}>Ghi chú: {addr.Note}</div>}
                      <div className="address-actions">
                        <button className="btn-delete" onClick={() => handleDeleteAddress(addr.AddressId)}>
                           Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <div className="profile-main-header">
                <h2>Lịch Sử Mua Hàng</h2>
                <p>Theo dõi trạng thái các đơn hàng bạn đã mua</p>
              </div>
              
              {orders.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#757575' }}>
                  <ion-icon name="receipt-outline" style={{ fontSize: '48px', color: '#e0e0e0' }}></ion-icon>
                  <h3>Chưa có đơn hàng</h3>
                  <p>Bạn vẫn chưa thực hiện giao dịch nào trên hệ thống.</p>
                </div>
              ) : (
                <div className="address-list">
                  {orders.map((o: any) => {
                    let statusText = 'Chờ Xử Lý';
                    let statusColor = 'orange';
                    if (o.Status === 1) { statusText = 'Đang Giao'; statusColor = '#1677ff'; }
                    if (o.Status === 2) { statusText = 'Hoàn Tất'; statusColor = '#52c41a'; }
                    if (o.Status === 3) { statusText = 'Đã Hủy'; statusColor = '#ff4d4f'; }
                    
                    return (
                      <div className="address-card" key={o.OrderId} style={{ borderLeft: `5px solid ${statusColor}`, marginBottom: 15 }}>
                        <div className="name-phone" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 16 }}>#{o.OrderId?.split('-')[0].toUpperCase()}</span>
                          <span style={{ color: statusColor, fontWeight: 'bold' }}>
                            {statusText}
                            {o.Status === 0 && (
                              <button 
                                onClick={() => handleCancelOrder(o.OrderId)}
                                style={{ marginLeft: 15, background: 'none', border: '1px solid #ff4d4f', color: '#ff4d4f', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}
                              >
                                Hủy Đơn
                              </button>
                            )}
                          </span>
                        </div>
                        <div className="address-details" style={{ marginTop: 15, fontSize: 15, lineHeight: 1.6 }}>
                          <div><strong>Ngày Đặt:</strong> {new Date(o.CreatedAt).toLocaleString('vi-VN')}</div>
                          <div><strong>Phương Thức C.Toán:</strong> {o.PaymentMethod}</div>
                          <div style={{ marginTop: 10, fontSize: 18 }}>
                            <strong>Tổng Tiền:</strong> <span style={{ color: '#d32f2f' }}>{o.Total?.toLocaleString('vi-VN')} ₫</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'security' && (
            <>
              <div className="profile-main-header">
                <h2>Đổi Mật Khẩu</h2>
                <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
              </div>

              <form className="profile-form" onSubmit={handleChangePassword}>
                <div className="form-group-row">
                  <label className="form-label">Mật Khẩu Hiện Tại</label>
                  <input 
                    type="password" placeholder="Nhập lại mật khẩu đang dùng" value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} required minLength={6} className="form-input" />
                </div>
                <div className="form-group-row">
                  <label className="form-label">Mật Khẩu Mới</label>
                  <input 
                    type="password" placeholder="Mật khẩu mới (từ 6 ký tự)" value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="form-input" />
                </div>
                <div className="form-group-row">
                  <label className="form-label">Xác Nhận Mật Khẩu Mới</label>
                  <input 
                    type="password" placeholder="Nhập lại mật khẩu mới ở trên" value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="form-input" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Lưu Mật Khẩu</button>
                </div>
              </form>
            </>
          )}
        </main>
        
      </div>

      {/* Address Form Modal */}
      {showAddressModal && (
        <div className="address-modal-overlay">
          <div className="address-modal">
            <h3>Thêm Địa Chỉ Mới</h3>
            <form onSubmit={handleSaveAddress}>
              <div className="form-grid">
                <div>
                  <label style={{fontSize: '13px', color: '#555'}}>Họ và tên người nhận</label>
                  <input type="text" className="form-input" style={{width: '100%', boxSizing: 'border-box', marginTop: '5px'}} required value={addrForm.fullName} onChange={e => setAddrForm({...addrForm, fullName: e.target.value})} />
                </div>
                <div>
                  <label style={{fontSize: '13px', color: '#555'}}>Số điện thoại</label>
                  <input type="tel" className="form-input" style={{width: '100%', boxSizing: 'border-box', marginTop: '5px'}} required value={addrForm.phone} onChange={e => setAddrForm({...addrForm, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-grid">
                <div>
                  <label style={{fontSize: '13px', color: '#555'}}>Tỉnh / Thành phố</label>
                  <input type="text" className="form-input" style={{width: '100%', boxSizing: 'border-box', marginTop: '5px'}} required value={addrForm.province} onChange={e => setAddrForm({...addrForm, province: e.target.value})} />
                </div>
                <div>
                  <label style={{fontSize: '13px', color: '#555'}}>Quận / Huyện</label>
                  <input type="text" className="form-input" style={{width: '100%', boxSizing: 'border-box', marginTop: '5px'}} required value={addrForm.district} onChange={e => setAddrForm({...addrForm, district: e.target.value})} />
                </div>
              </div>
              <div className="form-grid">
                <div>
                  <label style={{fontSize: '13px', color: '#555'}}>Phường / Xã</label>
                  <input type="text" className="form-input" style={{width: '100%', boxSizing: 'border-box', marginTop: '5px'}} required value={addrForm.ward} onChange={e => setAddrForm({...addrForm, ward: e.target.value})} />
                </div>
                <div>
                   <label style={{fontSize: '13px', color: '#555'}}>Ghi chú (Tùy chọn)</label>
                   <input type="text" className="form-input" style={{width: '100%', boxSizing: 'border-box', marginTop: '5px'}} value={addrForm.note} onChange={e => setAddrForm({...addrForm, note: e.target.value})} />
                </div>
              </div>
              <div className="form-col-full">
                <label style={{fontSize: '13px', color: '#555'}}>Địa chỉ cụ thể (Số nhà, Đường)</label>
                <input type="text" className="form-input" style={{width: '100%', boxSizing: 'border-box', marginTop: '5px'}} required value={addrForm.addressLine} onChange={e => setAddrForm({...addrForm, addressLine: e.target.value})} />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddressModal(false)}>Trở Lại</button>
                <button type="submit" className="btn-primary">Hoàn Thành</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
