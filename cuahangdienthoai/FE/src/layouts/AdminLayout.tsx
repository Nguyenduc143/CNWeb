
// FILE: AdminLayout.tsx - LAYOUT CHO TRANG QUẢN TRỊ (CMS)
// ------------------------------------------------------------
// Đây là "hộp" bọc tất cả admin pages. Có:
//   1. Sidebar bên trái: menu các module
//   2. Header: nút thu gọn sidebar + tên user
//   3. Content (ở giữa): Outlet để render page con
//
// Đặc biệt: AUTH GUARD tích hợp sẵn
//   - Decode JWT token để check role
//   - Nếu chưa đăng nhập / token hết hạn / role != Admin -> hiện 403
//   - Đây là tầng bảo vệ Ở FE (BE cũng có middleware riêng)


import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined,
  AppstoreOutlined, TagsOutlined, ShoppingCartOutlined,
  UserOutlined, LogoutOutlined, ProfileOutlined,
  ThunderboltOutlined, PictureOutlined, BarsOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Result, Spin } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';   // Để decode JWT mà không cần secret
import '../assets/Admin.css';

const { Header, Sider, Content } = Layout;


// TYPE: Hình dạng payload trong JWT mà BE đã tạo
// (xem authController.login -> generateToken({ id, username, role }))

interface JwtPayload {
  id: string;
  username: string;
  role: string;
  exp?: number;     // Unix timestamp (giây) khi token hết hạn
}

const AdminLayout: React.FC = () => {
  // State điều khiển sidebar thu gọn / mở rộng
  const [collapsed, setCollapsed] = useState(false);

  // 3 trạng thái guard: 'loading' (đang check) | 'authorized' | 'denied'
  const [authStatus, setAuthStatus] = useState<'loading' | 'authorized' | 'denied'>('loading');

  const navigate = useNavigate();
  const location = useLocation();

  // Lấy color theme của AntD để dùng cho header/content
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // ----------------------------------------------------------
  // GUARD: Kiểm tra quyền Admin khi component mount
  // ----------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    // Không có token -> từ chối ngay
    if (!token) {
      setAuthStatus('denied');
      return;
    }

    try {
      // Decode JWT (không verify chữ ký - đó là việc của BE)
      // Mục đích chỉ để LẤY THÔNG TIN ra hiển thị / điều hướng
      const decoded = jwtDecode<JwtPayload>(token);

      // Check token hết hạn: exp tính bằng giây, Date.now() tính bằng ms
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        setAuthStatus('denied');
        return;
      }

      // Check role có phải Admin không
      if (decoded.role === 'Admin') {
        setAuthStatus('authorized');
      } else {
        setAuthStatus('denied');
      }
    } catch {
      // Token bị hỏng / không phải JWT hợp lệ
      setAuthStatus('denied');
    }
  }, []);

  // ----------------------------------------------------------
  // RENDER 1: ĐANG CHECK QUYỀN
  // ----------------------------------------------------------
  if (authStatus === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
        <Spin size="large" tip="Đang xác thực quyền truy cập..." />
      </div>
    );
  }

  // ----------------------------------------------------------
  // RENDER 2: TỪ CHỐI TRUY CẬP (không đăng nhập / không phải admin)
  // ----------------------------------------------------------
  if (authStatus === 'denied') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
        <Result
          status="403"
          title="403 - Truy cập bị từ chối"
          subTitle="Bạn không có quyền Quản trị viên (Admin) để truy cập khu vực này."
          extra={[
            <Button type="primary" size="large" key="home" onClick={() => navigate('/')}>
              Về Trang Chủ
            </Button>,
            <Button size="large" key="login" onClick={() => navigate('/login')}>
              Đăng Nhập
            </Button>,
          ]}
        />
      </div>
    );
  }

  // ----------------------------------------------------------
  // HANDLER: Click menu sidebar
  // ----------------------------------------------------------
  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      // Đăng xuất: xoá token khỏi cả 2 storage rồi về login
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      navigate('/login');
    } else {
      // Các menu khác key trùng với path -> điều hướng trực tiếp
      navigate(e.key);
    }
  };

  // ----------------------------------------------------------
  // RENDER 3: GIAO DIỆN ADMIN CHÍNH (đã authorized)
  // ----------------------------------------------------------
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* === SIDEBAR === */}
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250}>
        <div className={`admin-sidebar-logo ${collapsed ? 'collapsed' : 'expanded'}`}>
          {collapsed ? 'CMS' : 'SUPER ADMIN'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}  // Highlight item theo URL hiện tại
          onClick={handleMenuClick}
          items={[
            { key: '/admin', icon: <DashboardOutlined />, label: 'Tổng Quan' },
            { key: '/admin/products', icon: <AppstoreOutlined />, label: 'Quản Lý Sản Phẩm' },
            { key: '/admin/categories', icon: <TagsOutlined />, label: 'Quản Lý Danh Mục' },
            { key: '/admin/brands', icon: <AppstoreOutlined />, label: 'Quản Lý Thương Hiệu' },
            { key: '/admin/orders', icon: <ShoppingCartOutlined />, label: 'Quản Lý Đơn Hàng' },
            { key: '/admin/flash-sale', icon: <ThunderboltOutlined />, label: 'Flash Sale' },
            { key: '/admin/banners', icon: <PictureOutlined />, label: 'Quản Lý Banner' },
            { key: '/admin/brand-sections', icon: <BarsOutlined />, label: 'Dải Sản Phẩm Trang Chủ' },
            { key: '/admin/news', icon: <ProfileOutlined />, label: 'Quản Lý Tin Tức' },
            { key: '/admin/users', icon: <UserOutlined />, label: 'Thành Viên' },
            { type: 'divider' },
            // Đặc biệt: key='logout' không phải URL, sẽ vào nhánh xử lý riêng
            { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng Xuất', danger: true },
          ]}
        />
      </Sider>

      {/* === KHU VỰC PHẢI: Header + Content === */}
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center' }}>
          {/* Nút thu gọn / mở rộng sidebar */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="admin-header-trigger"
          />
          <div className="admin-header-right">
            Quản trị viên Hệ thống
          </div>
        </Header>

        {/* Content: page con render vào đây qua <Outlet /> của react-router */}
        <Content
          className="admin-content"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
