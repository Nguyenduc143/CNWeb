import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import '../../assets/Profile.css';

const ProfilePage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account'); // Tabs: account, address, orders
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateProfile({ fullName, phone });
      alert('Cập nhật thông tin thành công!');
    } catch (error: any) {
      alert(error.message || 'Lỗi cập nhật');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
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
                  <input 
                    type="text" 
                    value={email} 
                    disabled 
                    className="form-input"
                  />
                </div>

                <div className="form-group-row">
                  <label className="form-label">Họ và Tên</label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A..." 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                    className="form-input"
                  />
                </div>

                <div className="form-group-row">
                  <label className="form-label">Số Điện Thoại</label>
                  <input 
                    type="tel" 
                     placeholder="Ví dụ: 0912345678" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === 'address' && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#757575' }}>
              <ion-icon name="location-outline" style={{ fontSize: '48px', color: '#e0e0e0' }}></ion-icon>
              <h3>Tính năng sắp ra mắt</h3>
              <p>Chức năng cập nhật địa chỉ giao hàng đang được chúng tôi thi công hệ thống Backend.</p>
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#757575' }}>
              <ion-icon name="receipt-outline" style={{ fontSize: '48px', color: '#e0e0e0' }}></ion-icon>
              <h3>Chưa có đơn hàng</h3>
              <p>Bạn vẫn chưa thực hiện giao dịch nào trên hệ thống.</p>
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
};

export default ProfilePage;
