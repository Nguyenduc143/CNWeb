import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ProfileOutlined, TeamOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import adminApi from '../../api/adminApi';
import '../../assets/Admin.css';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    Revenue: 0,
    PendingOrders: 0,
    ActiveProducts: 0,
    TotalCustomers: 0,
    monthlyRevenue: []
  });

  useEffect(() => {
    adminApi.getDashboardStats()
      .then((res: any) => {
        setStats(res.data?.stats || res.stats || {
          Revenue: 0, PendingOrders: 0, ActiveProducts: 0, TotalCustomers: 0, monthlyRevenue: []
        });
      })
      .catch((err: any) => message.error('Lỗi khi tải dữ liệu cấu hình Dashboard'));
  }, []);

  return (
    <div>
      <h2 className="admin-dashboard-title">Bảng Thống Kê Tổng Quan Hệ Thống</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="admin-stat-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 12 }}>
            <Statistic
              title={<span style={{ fontWeight: 600 }}>TỔNG DOANH THU</span>}
              value={stats.Revenue}
              precision={0}
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
              prefix={<ArrowUpOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="admin-stat-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 12 }}>
            <Statistic
              title={<span style={{ fontWeight: 600 }}>ĐƠN CHỜ DUYỆT</span>}
              value={stats.PendingOrders}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="admin-stat-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 12 }}>
            <Statistic 
              title={<span style={{ fontWeight: 600 }}>SẢN PHẨM KHẢ DỤNG</span>} 
              value={stats.ActiveProducts} 
              valueStyle={{ color: '#1677ff', fontWeight: 'bold' }} 
              prefix={<ProfileOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="admin-stat-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 12 }}>
            <Statistic 
              title={<span style={{ fontWeight: 600 }}>KHÁCH HÀNG</span>} 
              value={stats.TotalCustomers} 
              valueStyle={{ color: '#eb2f96', fontWeight: 'bold' }} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            className="admin-chart-card" 
            title={<span style={{ fontSize: 18, fontWeight: 700, color: '#1f1f1f' }}>Biểu Đồ Tăng Trưởng Doanh Thu (2026)</span>}
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 16 }}
          >
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={stats.monthlyRevenue || []}
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1677ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#8c8c8c" />
                  <YAxis stroke="#8c8c8c" tickFormatter={(val) => `${val / 1000000} Tr`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <Tooltip 
                    formatter={(value: any) => `${Number(value).toLocaleString('vi-VN')} ₫`} 
                    labelStyle={{ color: '#1f1f1f', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1677ff" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    name="Tổng Thu Nhập" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
