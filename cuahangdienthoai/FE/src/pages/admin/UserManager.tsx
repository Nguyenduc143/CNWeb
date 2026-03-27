import React, { useEffect, useState } from 'react';
import { Table, Switch, message, Tag, Select } from 'antd';
import adminApi from '../../api/adminApi';
import '../../assets/Admin.css';

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.getUsers();
      setUsers(res.data?.users || res.users || []);
    } catch (err) {
      message.error('Lỗi khi tải danh sách thành viên!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleLock = async (userId: string, isCurrentlyLocked: boolean) => {
    try {
      await adminApi.toggleUserLock(userId, !isCurrentlyLocked);
      message.success(!isCurrentlyLocked ? 'Đã khóa tài khoản thành công!' : 'Đã mở khóa tài khoản!');
      fetchUsers(); // Cập nhật lại danh sách
    } catch (err: any) {
      message.error('Không thể thay đổi trạng thái!');
    }
  };

  const columns = [
    {
      title: 'Khách hàng',
      key: 'Customer',
      render: (_: any, record: any) => (
        <div>
          <strong style={{ fontSize: 15 }}>{record.FullName || 'Chưa thiết lập tên'}</strong>
          <div style={{ color: '#8c8c8c', marginTop: 4 }}>{record.Email}</div>
        </div>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber',
      render: (text: string) => text || <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>Trống</span>,
    },
    {
      title: 'Phân Quyền',
      dataIndex: 'Role',
      key: 'Role',
      render: (text: string, record: any) => (
        <Select 
          value={text || 'Customer'} 
          style={{ width: 140 }}
          onChange={async (val) => {
            try {
              await adminApi.changeUserRole(record.UserId, val);
              message.success('Cập nhật phân quyền thành công!');
              fetchUsers();
            } catch (err) {
              message.error('Gặp lỗi khi phân quyền!');
            }
          }}
        >
          <Select.Option value="Customer"><Tag color="blue">Khách Hàng</Tag></Select.Option>
          <Select.Option value="Admin"><Tag color="gold">Quản Trị Viên</Tag></Select.Option>
        </Select>
      ),
    },
    {
      title: 'Ngày Đăng Ký',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      render: (val: string) => new Date(val).toLocaleString('vi-VN'),
    },
    {
      title: 'Khóa Tài Khoản',
      key: 'IsLocked',
      render: (_: any, record: any) => (
        <Switch 
          checked={record.IsLocked} 
          disabled={record.Role === 'Admin'} // Không cho phép khóa Admin
          onChange={() => handleToggleLock(record.UserId, record.IsLocked)}
          checkedChildren="Đã Khóa"
          unCheckedChildren="Hoạt Động"
          style={{ background: record.IsLocked ? '#ff4d4f' : '#52c41a' }}
        />
      )
    }
  ];

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Quản Lý Thành Viên (Users)</h2>
      </div>
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="UserId" 
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default UserManager;
