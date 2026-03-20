import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import '../../assets/Admin.css';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="admin-dashboard-title">Bảng Thống Kê Tổng Quan</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="admin-stat-card">
            <Statistic
              title="Doanh thu hôm nay"
              value={19340000}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="admin-stat-card">
            <Statistic
              title="Đơn hàng chờ duyệt"
              value={12}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="admin-stat-card">
            <Statistic title="Sản phẩm đang Active" value={145} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="admin-stat-card">
            <Statistic title="Khách hàng đăng ký" value={839} valueStyle={{ color: '#eb2f96' }} />
          </Card>
        </Col>
      </Row>
      
      <Card className="admin-chart-card" title="Biểu đồ doanh thu (Mô phỏng)">
        <div className="admin-chart-placeholder">
          <p className="admin-chart-icon">📍</p>
          <p>Khu vực tích hợp Biểu đồ (Sẽ cắm API Recharts/Chart.js vào đây)</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
