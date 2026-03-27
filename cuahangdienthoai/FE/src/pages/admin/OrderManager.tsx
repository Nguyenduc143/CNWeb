import React, { useEffect, useState } from 'react';
import { Table, Select, message, Tag } from 'antd';
import adminApi from '../../api/adminApi';
import '../../assets/Admin.css';

const { Option } = Select;

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleStatusChange = async (orderId: string, value: number) => {
    try {
      await adminApi.updateOrderStatus(orderId, value);
      message.success('Cập nhật trạng thái thành công!');
      fetchOrders();
    } catch (err) {
      message.error('Không thể cập nhật! Lỗi máy chủ.');
    }
  };

  const statusMap: any = {
    0: { text: 'Chờ Xử Lý', color: 'orange' },
    1: { text: 'Đang Giao', color: 'blue' },
    2: { text: 'Hoàn Tất', color: 'green' },
    3: { text: 'Đã Hủy', color: 'red' },
  };

  const columns = [
    {
      title: 'Mã Đơn',
      dataIndex: 'OrderId',
      key: 'OrderId',
      render: (text: string) => <span style={{ fontFamily: 'monospace' }}>{text.split('-')[0]}</span>,
    },
    {
      title: 'Khách Hàng',
      key: 'Customer',
      render: (_: any, record: any) => (
        <div>
          <strong>{record.CustomerName || record.Phone}</strong>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.CustomerEmail || 'Khách vãng lai'}</div>
        </div>
      )
    },
    {
      title: 'Địa Chỉ Giao',
      dataIndex: 'Address',
      key: 'Address',
      width: 250,
    },
    {
      title: 'Tổng Giá Trị',
      dataIndex: 'Total',
      key: 'Total',
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
      render: (_: any, record: any) => (
        <Select 
          value={record.Status} 
          style={{ width: '100%' }}
          onChange={(val) => handleStatusChange(record.OrderId, val)}
          disabled={record.Status === 3 || record.Status === 2} // Không sửa nếu Đã Hủy hoặc Đã Hoàn Tất
        >
          <Option value={0}>
            <Tag color="orange">Chờ Xử Lý</Tag>
          </Option>
          <Option value={1}>
            <Tag color="blue">Đang Giao</Tag>
          </Option>
          <Option value={2}>
            <Tag color="green">Hoàn Tất</Tag>
          </Option>
          <Option value={3}>
            <Tag color="red">Đã Hủy</Tag>
          </Option>
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
