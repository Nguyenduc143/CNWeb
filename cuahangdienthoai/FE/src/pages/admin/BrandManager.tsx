import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import adminApi from '../../api/adminApi';
import '../../assets/Admin.css';

const BrandManager: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form] = Form.useForm();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.getBrands();
      setBrands(res.brands || []);
    } catch (err) {
      message.error('Lỗi khi tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.MaThuongHieu || record.BrandId);
      form.setFieldsValue({ name: record.Ten || record.Name });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      if (editingId) {
        await adminApi.updateBrand(editingId, values);
        message.success('Cập nhật thương hiệu thành công');
      } else {
        await adminApi.createBrand(values);
        message.success('Thêm mới hãng sản xuất thành công');
      }
      setIsModalVisible(false);
      fetchBrands();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteBrand(id);
      message.success('Xóa thương hiệu báo cáo thành công');
      fetchBrands();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể xóa hãng này vì đang có sản phẩm tồn tại.');
    }
  };

  const columns = [
    {
      title: 'Tên Thương Hiệu (Hãng)',
      dataIndex: 'Ten',
      key: 'Ten',
      render: (text: string, record: any) => <strong>{text || record.Name}</strong>,
    },
    {
      title: 'Đường dẫn URL (Slug)',
      dataIndex: 'Slug',
      key: 'Slug',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => {
        const id = record.MaThuongHieu || record.BrandId;
        return (
          <Space size="middle">
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleOpenModal(record)} />
            <Popconfirm
              title="Xóa thương hiệu này?"
              onConfirm={() => handleDelete(id)}
              okText="Xóa bỏ"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Quản Lý Thương Hiệu (Brands)</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => handleOpenModal()}
          style={{ borderRadius: 8 }}
        >
          Đăng Ký Hãng Mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={brands} 
        rowKey={(record) => record.MaThuongHieu || record.BrandId} 
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingId ? "Sửa Tên Thương Hiệu" : "Thêm Hãng Sản Xuất"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu Dữ Liệu"
        cancelText="Khép Lại"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item 
            name="name" 
            label="Tên Hãng (Brand Name)" 
            rules={[{ required: true, message: 'Vui lòng nhập tên Hãng!' }]}
          >
            <Input placeholder="Ví dụ: Apple, Samsung, Xiaomi..." size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandManager;
