// ============================================================
// FILE: OrderManager.tsx - QUẢN LÝ ĐƠN HÀNG (ADMIN)

import React, { useEffect, useState } from 'react';
import { Table, Select, message, Tag } from 'antd';
import adminApi from '../../api/adminApi';
import '../../assets/Admin.css';

const { Option } = Select;

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------------
  // Tải danh sách đơn hàng từ BE
  // ----------------------------------------------------------
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.getOrders();
      setOrders(res.data?.orders || res.orders || []);
    } catch (err) {
      message.error('Lỗi lấy danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ----------------------------------------------------------
  // Đổi trạng thái đơn - gọi API và reload
  // ----------------------------------------------------------
  const handleStatusChange = async (orderId: string, value: number) => {
    try {
      await adminApi.updateOrderStatus(orderId, value);
      message.success('Cập nhật trạng thái thành công!');
      fetchOrders();
    } catch (err) {
      message.error('Không thể cập nhật! Lỗi máy chủ.');
    }
  };

  // ----------------------------------------------------------
  // CẤU HÌNH CỘT BẢNG
  // ----------------------------------------------------------
  const columns = [
    {
      title: 'Mã Đơn',
      dataIndex: 'OrderId',
      key: 'OrderId',
      // GUID rất dài -> chỉ hiển thị 8 ký tự đầu cho gọn
      render: (text: string) => <span style={{ fontFamily: 'monospace' }}>{text.split('-')[0]}</span>,
    },
    {
      title: 'Khách Hàng',
      key: 'Customer',
      // Render 2 dòng: tên + email
      render: (_: any, record: any) => (
        <div>
          <strong>{record.CustomerName || record.Phone}</strong>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.CustomerEmail || 'Khách vãng lai'}</div>
        </div>
      )
    },
    { title: 'Địa Chỉ Giao', dataIndex: 'Address', key: 'Address', width: 250 },
    {
      title: 'Tổng Giá Trị',
      dataIndex: 'Total',
      key: 'Total',
      // Format số -> tiền VNĐ (123,456,789 ₫)
      render: (val: number) => <strong>{val?.toLocaleString('vi-VN')} ₫</strong>,
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      render: (val: string) => new Date(val).toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng Thái',
      key: 'Status',
      width: 150,
      // Dropdown đổi trạng thái ngay trên row
      render: (_: any, record: any) => (
        <Select
          value={record.Status}
          style={{ width: '100%' }}
          onChange={(val) => handleStatusChange(record.OrderId, val)}
          // Khoá dropdown nếu đơn đã KẾT THÚC (Hủy hoặc Hoàn Tất)
          // -> tránh sửa nhầm trạng thái cuối
          disabled={record.Status === 3 || record.Status === 2}
        >
          <Option value={0}><Tag color="orange">Chờ Xử Lý</Tag></Option>
          <Option value={1}><Tag color="blue">Đang Giao</Tag></Option>
          <Option value={2}><Tag color="green">Hoàn Tất</Tag></Option>
          <Option value={3}><Tag color="red">Đã Hủy</Tag></Option>
        </Select>
      )
    }
  ];

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Quản Lý Đơn Hàng (Orders)</h2>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="OrderId"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default OrderManager;
