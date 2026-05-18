
// FILE: AdminDashboard.tsx - TRANG TỔNG QUAN HỆ THỐNG (CMS)


import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ProfileOutlined, TeamOutlined } from '@ant-design/icons';
// recharts: thư viện vẽ biểu đồ phổ biến cho React
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import adminApi from '../../api/adminApi';
import '../../assets/Admin.css';

const AdminDashboard: React.FC = () => {
  // State lưu các con số thống kê. Khởi tạo bằng 0 để tránh
  // hiển thị "undefined" trong khi đang loading từ server.
  const [stats, setStats] = useState({
    Revenue: 0,            // Tổng doanh thu
    PendingOrders: 0,      // Số đơn đang chờ duyệt
    ActiveProducts: 0,     // Số sản phẩm còn bán
    TotalCustomers: 0,     // Tổng số khách hàng
    monthlyRevenue: []     // Mảng dữ liệu cho biểu đồ
  });


  // Tải data từ BE 1 lần khi component mount

  useEffect(() => {
    adminApi.getDashboardStats()
      .then((res: any) => {
        // Fallback: BE có thể trả 2 dạng khác nhau (cũ/mới)
        setStats(res.data?.stats || res.stats || {
          Revenue: 0, PendingOrders: 0, ActiveProducts: 0, TotalCustomers: 0, monthlyRevenue: []
        });
      })
      .catch((err: any) => message.error('Lỗi khi tải dữ liệu cấu hình Dashboard'));
  }, []);

  return (
    <div>
      <h2 className="admin-dashboard-title">Bảng Thống Kê Tổng Quan Hệ Thống</h2>

      {/* ==========================================================
          KHỐI 1: 4 CARD THỐNG KÊ NHANH (RESPONSIVE GRID)
          - Antd Row/Col: hệ grid 24 cột
          - xs={24} sm={12} lg={6} = mobile 1 cột, tablet 2 cột, desktop 4 cột
          ========================================================== */}
      <Row gutter={[16, 16]}>
        {/* CARD 1: TỔNG DOANH THU */}
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

        {/* CARD 2: ĐƠN CHỜ DUYỆT (admin cần xử lý) */}
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

        {/* CARD 3: SẢN PHẨM KHẢ DỤNG (còn bán) */}
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

        {/* CARD 4: TỔNG SỐ KHÁCH HÀNG */}
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

      {/* ==========================================================
          KHỐI 2: BIỂU ĐỒ AREA CHART DOANH THU 6 THÁNG
          ========================================================== */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            className="admin-chart-card"
            title={<span style={{ fontSize: 18, fontWeight: 700, color: '#1f1f1f' }}>Biểu Đồ Tăng Trưởng Doanh Thu (2026)</span>}
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 16 }}
          >
            <div style={{ width: '100%', height: 400 }}>
              {/* ResponsiveContainer: tự fit theo chiều rộng cha */}
              <ResponsiveContainer>
                <AreaChart
                  data={stats.monthlyRevenue || []}
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  {/* defs + linearGradient: tạo hiệu ứng đổ màu cho area
                      (đậm trên đỉnh, mờ dần xuống đáy) */}
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1677ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  {/* Trục X: nhãn tháng (lấy từ field "name" của data) */}
                  <XAxis dataKey="name" stroke="#8c8c8c" />

                  {/* Trục Y: format số tiền lớn thành dạng "120 Tr" cho gọn */}
                  <YAxis stroke="#8c8c8c" tickFormatter={(val) => `${val / 1000000} Tr`} />

                  {/* Lưới ngang đứt nét */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

                  {/* Tooltip hiện khi hover, format đầy đủ tiền VN */}
                  <Tooltip
                    formatter={(value: any) => `${Number(value).toLocaleString('vi-VN')} ₫`}
                    labelStyle={{ color: '#1f1f1f', fontWeight: 'bold' }}
                  />

                  {/* Area = vùng đồ thị, dataKey="revenue" lấy giá trị doanh thu */}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1677ff"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"   // tham chiếu gradient ở trên
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
