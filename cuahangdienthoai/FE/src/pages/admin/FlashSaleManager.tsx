import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Switch, message, Tag, Popconfirm, InputNumber, Select, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';
import adminApi from '../../api/adminApi';
import dayjs from 'dayjs';

const statusMap: Record<string, { label: string; color: string }> = {
  DANG_DIEN_RA: { label: 'Đang diễn ra', color: 'red' },
  SAP_DIEN_RA: { label: 'Sắp diễn ra', color: 'blue' },
  DA_KET_THUC: { label: 'Đã kết thúc', color: 'default' },
  TAM_DUNG: { label: 'Tạm dừng', color: 'orange' },
};

const FlashSaleManager: React.FC = () => {
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // Chi tiết Flash Sale
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailItems, setDetailItems] = useState<any[]>([]);

  // Thêm sản phẩm vào Flash Sale
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [addItemForm] = Form.useForm();
  const [allProducts, setAllProducts] = useState<any[]>([]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.getFlashSales();
      setFlashSales(res.data?.flashSales || res.flashSales || []);
    } catch { message.error('Lỗi tải danh sách Flash Sale'); }
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditingId(record.MaFlashSale);
    form.setFieldsValue({
      tenSuKien: record.TenSuKien,
      thoiGian: [dayjs(record.ThoiGianBatDau), dayjs(record.ThoiGianKetThuc)],
      dangHoatDong: record.DangHoatDong,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        tenSuKien: values.tenSuKien,
        thoiGianBatDau: values.thoiGian[0].toISOString(),
        thoiGianKetThuc: values.thoiGian[1].toISOString(),
        dangHoatDong: values.dangHoatDong ?? true,
      };

      if (editingId) {
        await adminApi.updateFlashSale(editingId, payload);
        message.success('Cập nhật thành công');
      } else {
        await adminApi.createFlashSale(payload);
        message.success('Tạo Flash Sale thành công');
      }
      setModalOpen(false);
      fetchList();
    } catch (err: any) {
      message.error(err.message || 'Lỗi lưu');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteFlashSale(id);
      message.success('Đã xóa');
      fetchList();
    } catch { message.error('Lỗi xóa'); }
  };

  // Mở chi tiết
  const openDetail = async (id: number) => {
    try {
      const res: any = await adminApi.getFlashSaleDetail(id);
      const data = res.data || res;
      setDetailData(data.flashSale);
      setDetailItems(data.items || []);
      setDetailOpen(true);
    } catch { message.error('Lỗi tải chi tiết'); }
  };

  // Thêm sản phẩm
  const openAddItem = async () => {
    addItemForm.resetFields();
    try {
      const res: any = await adminApi.getProducts();
      setAllProducts(res.data?.products || res.products || []);
    } catch { /* ignore */ }
    setAddItemOpen(true);
  };

  const handleAddItem = async () => {
    try {
      const values = await addItemForm.validateFields();
      await adminApi.addFlashSaleItem({
        maFlashSale: detailData.MaFlashSale,
        maSanPham: values.maSanPham,
        giaFlashSale: values.giaFlashSale,
        soLuongGioiHan: values.soLuongGioiHan || 0,
      });
      message.success('Đã thêm sản phẩm');
      setAddItemOpen(false);
      openDetail(detailData.MaFlashSale);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi thêm sản phẩm');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await adminApi.removeFlashSaleItem(itemId);
      message.success('Đã xóa sản phẩm');
      openDetail(detailData.MaFlashSale);
    } catch { message.error('Lỗi'); }
  };

  const columns = [
    { title: 'ID', dataIndex: 'MaFlashSale', width: 60 },
    { title: 'Tên Sự Kiện', dataIndex: 'TenSuKien' },
    {
      title: 'Thời Gian',
      render: (_: any, r: any) => (
        <span>{dayjs(r.ThoiGianBatDau).format('DD/MM/YY HH:mm')} → {dayjs(r.ThoiGianKetThuc).format('DD/MM/YY HH:mm')}</span>
      ),
    },
    { title: 'Số SP', dataIndex: 'SoSanPham', width: 70 },
    {
      title: 'Trạng Thái',
      dataIndex: 'TrangThaiHienTai',
      render: (val: string) => {
        const s = statusMap[val] || { label: val, color: 'default' };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: 'Hành Động',
      width: 260,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="small" onClick={() => openDetail(record.MaFlashSale)}>Chi tiết</Button>
          <Button size="small" type="primary" onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa Flash Sale này?" onConfirm={() => handleDelete(record.MaFlashSale)}>
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const itemColumns = [
    {
      title: 'Ảnh', dataIndex: 'Image1', width: 60,
      render: (url: string) => url ? <img src={url} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} /> : '-',
    },
    { title: 'Sản Phẩm', dataIndex: 'ProductName' },
    {
      title: 'Giá Gốc', dataIndex: 'PriceSell',
      render: (v: number) => v?.toLocaleString('vi-VN') + ' ₫',
    },
    {
      title: 'Giá Flash Sale', dataIndex: 'GiaFlashSale',
      render: (v: number) => <span style={{ color: '#d70018', fontWeight: 700 }}>{v?.toLocaleString('vi-VN')} ₫</span>,
    },
    {
      title: 'Giảm',
      render: (_: any, r: any) => {
        const pct = Math.round(((r.PriceSell - r.GiaFlashSale) / r.PriceSell) * 100);
        return <Tag color="red">-{pct}%</Tag>;
      },
    },
    { title: 'Giới Hạn', dataIndex: 'SoLuongGioiHan' },
    { title: 'Đã Bán', dataIndex: 'DaBan' },
    {
      title: '', width: 60,
      render: (_: any, r: any) => (
        <Popconfirm title="Xóa SP khỏi Flash Sale?" onConfirm={() => handleRemoveItem(r.MaChiTiet)}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}><ThunderboltOutlined style={{ color: '#d70018' }} /> Quản Lý Flash Sale</h2>
        <Button type="primary" danger icon={<PlusOutlined />} onClick={openCreate}>Tạo Flash Sale</Button>
      </div>

      <Table
        dataSource={flashSales}
        columns={columns}
        rowKey="MaFlashSale"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal Tạo/Sửa Flash Sale */}
      <Modal
        title={editingId ? 'Chỉnh Sửa Flash Sale' : 'Tạo Flash Sale Mới'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" initialValues={{ dangHoatDong: true }}>
          <Form.Item name="tenSuKien" label="Tên Sự Kiện" rules={[{ required: true, message: 'Nhập tên sự kiện' }]}>
            <Input placeholder="VD: Flash Sale Cuối Tuần" />
          </Form.Item>
          <Form.Item name="thoiGian" label="Thời Gian Diễn Ra" rules={[{ required: true, message: 'Chọn khoảng thời gian' }]}>
            <DatePicker.RangePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="dangHoatDong" label="Kích Hoạt" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Chi Tiết Flash Sale */}
      <Modal
        title={detailData ? `Chi Tiết: ${detailData.TenSuKien}` : 'Chi Tiết Flash Sale'}
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={850}
      >
        {detailData && (
          <Card size="small" style={{ marginBottom: 16 }}>
            <p><strong>Thời gian:</strong> {dayjs(detailData.ThoiGianBatDau).format('DD/MM/YYYY HH:mm')} → {dayjs(detailData.ThoiGianKetThuc).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Trạng thái:</strong> {detailData.DangHoatDong ? <Tag color="green">Đang bật</Tag> : <Tag color="orange">Tạm dừng</Tag>}</p>
          </Card>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <strong>Sản phẩm trong sự kiện ({detailItems.length})</strong>
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={openAddItem}>Thêm sản phẩm</Button>
        </div>

        <Table
          dataSource={detailItems}
          columns={itemColumns}
          rowKey="MaChiTiet"
          pagination={false}
          size="small"
        />
      </Modal>

      {/* Modal Thêm SP vào Flash Sale */}
      <Modal
        title="Thêm Sản Phẩm Vào Flash Sale"
        open={addItemOpen}
        onOk={handleAddItem}
        onCancel={() => setAddItemOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={addItemForm} layout="vertical">
          <Form.Item name="maSanPham" label="Chọn Sản Phẩm" rules={[{ required: true, message: 'Chọn sản phẩm' }]}>
            <Select
              showSearch
              placeholder="Tìm và chọn sản phẩm"
              optionFilterProp="label"
              options={allProducts.map((p: any) => ({
                value: p.ProductId,
                label: `${p.Name || p.ProductName} - ${(p.PriceSell ?? 0).toLocaleString('vi-VN')} ₫`,
              }))}
            />
          </Form.Item>
          <Form.Item name="giaFlashSale" label="Giá Flash Sale (₫)" rules={[{ required: true, message: 'Nhập giá' }]}>
            <InputNumber style={{ width: '100%' }} min={0} placeholder="VD: 15990000" formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          <Form.Item name="soLuongGioiHan" label="Số Lượng Giới Hạn (0 = không giới hạn)">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="VD: 50" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FlashSaleManager;
