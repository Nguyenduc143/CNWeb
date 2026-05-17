import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ThunderboltOutlined,
  PictureOutlined,
  BarsOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Result, Spin } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../assets/Admin.css';

const { Header, Sider, Content } = Layout;

// Kiểu dữ liệu JWT payload
interface JwtPayload {
  id: string;
  username: string;
  role: string;
  exp?: number;
}

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authorized' | 'denied'>('loading');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Kiểm tra quyền Admin khi component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    if (!token) {
      setAuthStatus('denied');
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Kiểm tra token hết hạn
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        setAuthStatus('denied');
        return;
      }

      // Kiểm tra role Admin
      if (decoded.role === 'Admin') {
        setAuthStatus('authorized');
      } else {
        setAuthStatus('denied');
      }
    } catch {
      setAuthStatus('denied');
    }
  }, []);

  // Màn hình loading
  if (authStatus === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
        <Spin size="large" tip="Đang xác thực quyền truy cập..." />
      </div>
    );
  }

  // Màn hình từ chối truy cập
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

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      navigate('/login');
    } else {
      navigate(e.key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250}>
        <div className={`admin-sidebar-logo ${collapsed ? 'collapsed' : 'expanded'}`}>
          {collapsed ? 'CMS' : 'SUPER ADMIN'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={[
            {
              key: '/admin',
              icon: <DashboardOutlined />,
              label: 'Tổng Quan',
            },
            {
              key: '/admin/products',
              icon: <AppstoreOutlined />,
              label: 'Quản Lý Sản Phẩm',
            },
            {
              key: '/admin/categories',
              icon: <TagsOutlined />,
              label: 'Quản Lý Danh Mục',
            },
            {
              key: '/admin/brands',
              icon: <AppstoreOutlined />,
              label: 'Quản Lý Thương Hiệu',
            },
            {
              key: '/admin/orders',
              icon: <ShoppingCartOutlined />,
              label: 'Quản Lý Đơn Hàng',
            },
            {
              key: '/admin/flash-sale',
              icon: <ThunderboltOutlined />,
              label: 'Flash Sale',
            },
            {
              key: '/admin/banners',
              icon: <PictureOutlined />,
              label: 'Quản Lý Banner',
            },
            {
              key: '/admin/brand-sections',
              icon: <BarsOutlined />,
              label: 'Dải Sản Phẩm Trang Chủ',
            },
            {
              key: '/admin/news',
              icon: <ProfileOutlined />,
              label: 'Quản Lý Tin Tức',
            },
            {
              key: '/admin/users',
              icon: <UserOutlined />,
              label: 'Thành Viên',
            },
            {
              type: 'divider',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Đăng Xuất',
              danger: true,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center' }}>
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
