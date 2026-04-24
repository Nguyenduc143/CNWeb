import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import adminApi from '../../api/adminApi';

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [resProd, resCat, resBrand]: any = await Promise.all([
        adminApi.getProducts(),
        adminApi.getCategories(),
        adminApi.getBrands()
      ]);
      setProducts(resProd.products || []);
      setCategories(resCat.categories || []);
      setBrands(resBrand.brands || []);
    } catch (err: any) {
      message.error(err.message || 'Lỗi tải danh mục / sản phẩm');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.ProductId);
    form.setFieldsValue({
      name: record.Name,
      categoryId: record.CategoryId || null,
      brandId: record.BrandId || null,
      priceImport: record.PriceImport,
      priceSell: record.PriceSell,
      stock: record.Stock,
      ramGB: record.RamGB,
      romGB: record.RomGB,
      color: record.Color,
      image1: record.Image1,
      description: record.Description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteProduct(id);
      message.success('Xóa sản phẩm thành công!');
      fetchProducts();
    } catch (err: any) {
      message.error(err.message || 'Không thể xóa sản phẩm này');
    }
  };

  const handleSave = async (values: any) => {
    try {
      if (editingId) {
        await adminApi.updateProduct(editingId, values);
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        await adminApi.createProduct(values);
        message.success('Thêm mới sản phẩm thành công!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      message.error(err.message || 'Lưu thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'Name',
      key: 'Name',
      render: (text: string, record: any) => (
        <Space>
          {record.Image1 && <img src={record.Image1} alt="thumb" style={{width: 30, height: 30, objectFit: 'cover'}}/>}
          <strong>{text}</strong>
        </Space>
      )
    },
    {
      title: 'Giá Bán',
      dataIndex: 'PriceSell',
      key: 'PriceSell',
      render: (val: number) => <span style={{color: '#d32f2f'}}>{val?.toLocaleString('vi-VN')} ₫</span>
    },
    {
      title: 'Tồn Kho',
      dataIndex: 'Stock',
      key: 'Stock',
      render: (val: number) => <span style={{ color: val > 0 ? '#52c41a' : '#f5222d' }}>{val}</span>
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa bỏ sản phẩm này vĩnh viễn?" onConfirm={() => handleDelete(record.ProductId)}>
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{margin: 0}}>Kho Hàng (Products)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Sản Phẩm Mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="ProductId" 
        loading={loading}
        pagination={{ pageSize: 12 }}
      />

      <Modal
        title={editingId ? "Sửa Sản Phẩm" : "Thêm Đặc Tả Sản Phẩm"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={700}
        okText="Lưu Dữ Liệu"
        cancelText="Hủy Bỏ"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Tên điện thoại" rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}>
            <Input placeholder="Ví dụ: iPhone 15 Pro Max 256GB" />
          </Form.Item>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="categoryId" label="Danh Mục" rules={[{ required: true, message: 'Vui lòng chọnDanh Mục!' }]}>
              <Select placeholder="Chọn Danh Mục" style={{ width: 180 }}>
                {categories.map((c: any) => (
                  <Select.Option key={c.CategoryId} value={c.CategoryId}>{c.Name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="brandId" label="Thương Hiệu" rules={[{ required: true, message: 'Vui lòng chọn Hãng!' }]}>
              <Select placeholder="Chọn Thương Hiệu" style={{ width: 180 }}>
                {brands.map((b: any) => (
                  <Select.Option key={b.MaThuongHieu || b.BrandId} value={b.MaThuongHieu || b.BrandId}>
                    {b.Ten || b.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="priceImport" label="Giá Nhập">
              <InputNumber style={{width: 200}} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item name="priceSell" label="Giá Bán (Hiển thị Khách)" rules={[{ required: true }]}>
              <InputNumber style={{width: 200}} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item name="stock" label="Tồn Kho">
              <InputNumber style={{width: 150}} />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="ramGB" label="Dung lượng RAM (GB)">
              <InputNumber style={{width: 150}} />
            </Form.Item>
            <Form.Item name="romGB" label="Dung lượng ROM (GB)">
              <InputNumber style={{width: 150}} />
            </Form.Item>
            <Form.Item name="color" label="Màu Sắc">
              <Input style={{width: 150}} />
            </Form.Item>
          </Space>

          <Form.Item name="image1" label="Link Ảnh (URL)">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="description" label="Bài Viết Đánh Giá (Mô tả)">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;
