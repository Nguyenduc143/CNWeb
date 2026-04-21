import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../assets/Admin.css';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
              label: 'Danh Mục & Hãng',
            },
            {
              key: '/admin/orders',
              icon: <ShoppingCartOutlined />,
              label: 'Quản Lý Đơn Hàng',
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
