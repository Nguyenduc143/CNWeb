import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import adminApi from '../../api/adminApi';

const NewsManager: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.getNews();
      setNews(res.data?.news || res.news || []);
    } catch (err: any) {
      message.error(err.message || 'Lỗi tải danh mục tin tức');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ TrangThai: true });
    setIsModalOpen(true);
  };


  const handleEdit = (record: any) => {
    setEditingId(record.MaTinTuc);
    form.setFieldsValue({
      TieuDe: record.TieuDe,
      TomTat: record.TomTat,
      NoiDung: record.NoiDung,
      HinhThuNho: record.HinhThuNho,
      TrangThai: record.TrangThai === true || record.TrangThai === 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteNews(id);
      message.success('Xóa bài đăng thành công!');
      fetchNews();
    } catch (err: any) {
      message.error(err.message || 'Không thể xóa bài này');
    }
  };

  const handleSave = async (values: any) => {
    try {
      const payload = { ...values, TrangThai: values.TrangThai ? 1 : 0 };
      if (editingId) {
        await adminApi.updateNews(editingId, payload);
        message.success('Cập nhật bản tin thành công!');
      } else {
        await adminApi.createNews(payload);
        message.success('Đăng tin mới thành công!');
      }
      setIsModalOpen(false);
      fetchNews();
    } catch (err: any) {
      message.error(err.message || 'Lưu thất bại');
    }
  };

  const columns = [
    {
      title: 'Hình Ảnh',
      dataIndex: 'HinhThuNho',
      key: 'HinhThuNho',
      render: (img: string) => img ? <img src={img} alt="thumb" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: '4px' }} /> : <span>---</span>
    },
    {
      title: 'Tiêu Đề Bài Viết',
      dataIndex: 'TieuDe',
      key: 'TieuDe',
      render: (text: string) => <strong style={{ color: '#1677ff' }}>{text}</strong>
    },
    {
      title: 'Tóm Tắt',
      dataIndex: 'TomTat',
      key: 'TomTat',
      width: 300,
      render: (text: string) => <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px', fontSize: '13px' }}>{text}</div>
    },
    {
      title: 'Ngày Đăng',
      dataIndex: 'NgayDang',
      key: 'NgayDang',
      render: (val: string) => new Date(val).toLocaleDateString('vi-VN')
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'TrangThai',
      key: 'TrangThai',
      render: (status: any) => (
        <Switch checked={status === true || status === 1} disabled />
      )
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa bỏ vĩnh viễn tin tức này?" onConfirm={() => handleDelete(record.MaTinTuc)}>
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Bảng Tin (News & Blog)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Đăng Tải Tin Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={news}
        rowKey="MaTinTuc"
        loading={loading}
        pagination={{ pageSize: 8 }}
        bordered
      />

      <Modal
        title={editingId ? "Biên Tập Tin Tức" : "Tạo Mới Bài Viết"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={750}
        okText="Lưu Trữ Báo"
        cancelText="Hủy Bỏ"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="TieuDe" label="Tiêu đề chính" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
            <Input placeholder="Nhập tiêu đề thu hút người đọc..." />
          </Form.Item>

          <Form.Item name="TomTat" label="Đoạn tóm tắt (Sapo)">
            <Input.TextArea rows={2} placeholder="Vài dòng khái quát bài viết..." />
          </Form.Item>

          <Form.Item name="NoiDung" label="Nội dung bài viết (Rich Text HTML)" rules={[{ required: true, message: 'Nhập nội dung' }]}>
            <Input.TextArea rows={6} placeholder="Gõ nội dung hoàn chỉnh hoặc mã HTML..." />
          </Form.Item>

          <Form.Item name="HinhThuNho" label="Link hình Ảnh Thu Nhỏ (Thumbnail URL)">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="TrangThai" label="Trạng thái Đăng bài" valuePropName="checked">
            <Switch checkedChildren="Công Khai" unCheckedChildren="Bản Nháp" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsManager;
