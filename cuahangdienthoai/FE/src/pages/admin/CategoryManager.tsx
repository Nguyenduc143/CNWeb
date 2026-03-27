import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import adminApi from '../../api/adminApi';
import '../../assets/Admin.css';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.getCategories();
      setCategories(res.data?.categories || res.categories || []);
    } catch (err) {
      message.error('Lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.CategoryId);
      form.setFieldsValue({ name: record.Name });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      if (editingId) {
        await adminApi.updateCategory(editingId, values);
        message.success('Cập nhật thành công');
      } else {
        await adminApi.createCategory(values);
        message.success('Thêm mới thành công');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteCategory(id);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Danh mục đang được sử dụng (có sản phẩm). Không thể xóa.');
    }
  };

  const columns = [
    {
      title: 'Mã số',
      dataIndex: 'CategoryId',
      key: 'CategoryId',
      width: 100,
    },
    {
      title: 'Tên Danh Mục',
      dataIndex: 'Name',
      key: 'Name',
      render: (text: string) => <strong>{text}</strong>,
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
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleOpenModal(record)} />
          <Popconfirm
            title="Xóa danh mục này?"
            description="Chú ý: Sẽ lỗi nếu bạn chưa xóa hết Sản phẩm và Hình ảnh bên trong!"
            onConfirm={() => handleDelete(record.CategoryId)}
            okText="Xóa luôn"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Quản Lý Danh Mục (Categories)</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => handleOpenModal()}
          style={{ borderRadius: 8 }}
        >
          Thêm Danh Mục Mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={categories} 
        rowKey="CategoryId" 
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingId ? "Sửa Danh Mục" : "Thêm Danh Mục Khởi Tạo"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu Dữ Liệu"
        cancelText="Hủy Bỏ"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item 
            name="name" 
            label="Tên Danh Mục" 
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Ví dụ: Phụ kiện Điện thoại..." size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManager;
