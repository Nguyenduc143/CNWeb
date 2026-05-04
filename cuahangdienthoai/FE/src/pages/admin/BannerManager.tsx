import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Switch, Space,
  Popconfirm, message, Tag, InputNumber, Select, Tooltip
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import adminApi from '../../api/adminApi';

const TAG_ICON_OPTIONS = [
  { value: 'flame', label: '🔥 flame (HOT)' },
  { value: 'star', label: '⭐ star (MỚI)' },
  { value: 'diamond-outline', label: '💎 diamond (CAO CẤP)' },
  { value: 'gift-outline', label: '🎁 gift (KHUYẾN MÃI)' },
  { value: 'flash-outline', label: '⚡ flash (FLASH SALE)' },
  { value: 'trophy-outline', label: '🏆 trophy (BEST SELLER)' },
  { value: 'pricetag-outline', label: '🏷️ pricetag (GIÁ TỐT)' },
];

const GRADIENT_PRESETS = [
  { label: 'Xanh đêm (iPhone)', value: 'linear-gradient(135deg, #0a0a1a 0%, #13131f 50%, #0d2137 100%)' },
  { label: 'Navy (Samsung)', value: 'linear-gradient(135deg, #0d0d1a 0%, #141430 50%, #1a2060 100%)' },
  { label: 'Tím đêm (Fold)', value: 'linear-gradient(135deg, #0f0f20 0%, #1a1040 50%, #0e2040 100%)' },
  { label: 'Đỏ đen (Sale)', value: 'linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #1a0010 100%)' },
  { label: 'Xanh lá', value: 'linear-gradient(135deg, #0a1a0a 0%, #0d2010 50%, #0a1a15 100%)' },
];

const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewBanner, setPreviewBanner] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res: any = await adminApi.getBanners();
      setBanners(res.data?.banners || res.banners || []);
    } catch (err: any) {
      message.error(err.message || 'Lỗi tải danh sách banner');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      DangHoatDong: true,
      ThuTu: (banners.length + 1),
      NutText: 'Mua ngay',
      NutLink: '/products',
      TagIcon: 'flame',
      MauNen: GRADIENT_PRESETS[0].value,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.MaBanner);
    form.setFieldsValue({
      TieuDe: record.TieuDe,
      TieuDePhu: record.TieuDePhu,
      MoTa: record.MoTa,
      GiaHienThi: record.GiaHienThi,
      NutText: record.NutText,
      NutLink: record.NutLink,
      HinhAnh: record.HinhAnh,
      MauNen: record.MauNen,
      TagText: record.TagText,
      TagIcon: record.TagIcon,
      ThuTu: record.ThuTu,
      DangHoatDong: record.DangHoatDong === true || record.DangHoatDong === 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteBanner(id);
      message.success('Đã xóa banner!');
      fetchBanners();
    } catch (err: any) {
      message.error(err.message || 'Không thể xóa banner này');
    }
  };

  const handleSave = async (values: any) => {
    try {
      const payload = { ...values, DangHoatDong: values.DangHoatDong ? 1 : 0 };
      if (editingId) {
        await adminApi.updateBanner(editingId, payload);
        message.success('Cập nhật banner thành công!');
      } else {
        await adminApi.createBanner(payload);
        message.success('Tạo banner mới thành công!');
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (err: any) {
      message.error(err.message || 'Lưu thất bại');
    }
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'ThuTu',
      key: 'ThuTu',
      width: 50,
      render: (val: number) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Hình Nền',
      dataIndex: 'MauNen',
      key: 'MauNen',
      width: 80,
      render: (bg: string) => (
        <div style={{ width: 48, height: 30, borderRadius: 6, background: bg, border: '1px solid #e0e0e0' }} />
      ),
    },
    {
      title: 'Ảnh SP',
      dataIndex: 'HinhAnh',
      key: 'HinhAnh',
      width: 70,
      render: (img: string) => img
        ? <img src={img} alt="banner" style={{ width: 50, height: 34, objectFit: 'contain', borderRadius: 4, background: '#111' }} />
        : <span style={{ color: '#aaa', fontSize: 12 }}>---</span>,
    },
    {
      title: 'Tiêu Đề',
      dataIndex: 'TieuDe',
      key: 'TieuDe',
      render: (text: string, record: any) => (
        <div>
          <strong style={{ color: '#1677ff' }}>{text}</strong>
          {record.TagText && (
            <Tag color="red" style={{ marginLeft: 8, fontSize: 10 }}>{record.TagText}</Tag>
          )}
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{record.TieuDePhu}</div>
        </div>
      ),
    },
    {
      title: 'Giá Hiển Thị',
      dataIndex: 'GiaHienThi',
      key: 'GiaHienThi',
      render: (val: string) => <span style={{ color: '#d48806', fontWeight: 700 }}>{val}</span>,
    },
    {
      title: 'Nút CTA',
      key: 'nut',
      render: (_: any, record: any) => (
        <div style={{ fontSize: 12 }}>
          <div><strong>{record.NutText}</strong></div>
          <div style={{ color: '#888' }}>{record.NutLink}</div>
        </div>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'DangHoatDong',
      key: 'DangHoatDong',
      render: (val: any) => (
        <Switch checked={val === true || val === 1} disabled />
      ),
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Xem trước">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => setPreviewBanner(record)}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa banner này?"
            description="Thao tác không thể hoàn tác!"
            onConfirm={() => handleDelete(record.MaBanner)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0 }}>Quản Lý Banner Trang Chủ</h2>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>
            Cấu hình các slide banner hiển thị trên giao diện người dùng
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Banner Mới
        </Button>
      </div>

      {/* Bảng danh sách */}
      <Table
        columns={columns}
        dataSource={banners}
        rowKey="MaBanner"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        title={editingId ? '✏️ Chỉnh Sửa Banner' : '➕ Tạo Banner Mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={700}
        okText="Lưu Banner"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="TieuDe" label="Tiêu đề chính" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
            <Input placeholder="VD: iPhone 16 Pro Max" />
          </Form.Item>

          <Form.Item name="TieuDePhu" label="Tiêu đề phụ">
            <Input placeholder="VD: Siêu phẩm mới nhất từ Apple" />
          </Form.Item>

          <Form.Item name="MoTa" label="Mô tả ngắn">
            <Input.TextArea rows={2} placeholder="VD: Camera 48MP, chip A18 Pro, màn hình 6.9&quot;..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="GiaHienThi" label="Giá hiển thị">
              <Input placeholder="VD: Từ 32.900.000 ₫" />
            </Form.Item>
            <Form.Item name="ThuTu" label="Thứ tự hiển thị">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="NutText" label="Chữ nút CTA">
              <Input placeholder="VD: Mua ngay" />
            </Form.Item>
            <Form.Item name="NutLink" label="Link nút CTA">
              <Input placeholder="VD: /products" />
            </Form.Item>
          </div>

          <Form.Item name="HinhAnh" label="Đường dẫn ảnh sản phẩm (URL)">
            <Input placeholder="VD: /image/slide1.png hoặc https://..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="TagText" label="Tag nhãn (VD: HOT, MỚI)">
              <Input placeholder="VD: HOT" maxLength={12} />
            </Form.Item>
            <Form.Item name="TagIcon" label="Icon Tag">
              <Select options={TAG_ICON_OPTIONS} />
            </Form.Item>
          </div>

          <Form.Item name="MauNen" label="Màu nền gradient">
            <Select
              options={GRADIENT_PRESETS.map(p => ({
                value: p.value,
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 18, borderRadius: 4, background: p.value }} />
                    {p.label}
                  </div>
                ),
              }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0' }}>
                    <Form.Item name="MauNen" noStyle>
                      <Input placeholder="Hoặc nhập gradient CSS tùy chỉnh..." />
                    </Form.Item>
                  </div>
                </>
              )}
            />
          </Form.Item>

          <Form.Item name="DangHoatDong" label="Hiển thị trên website" valuePropName="checked">
            <Switch checkedChildren="Đang hiện" unCheckedChildren="Đã ẩn" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Preview Banner */}
      <Modal
        title="👁️ Xem Trước Banner"
        open={!!previewBanner}
        onCancel={() => setPreviewBanner(null)}
        footer={null}
        width={800}
      >
        {previewBanner && (
          <div style={{
            background: previewBanner.MauNen,
            borderRadius: 12,
            padding: '32px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            minHeight: 200,
          }}>
            <div style={{ color: '#fff', flex: 1 }}>
              {previewBanner.TagText && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#d70018', color: '#fff', fontSize: 11,
                  fontWeight: 800, padding: '4px 14px', borderRadius: 100,
                  letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14,
                }}>
                  {previewBanner.TagText}
                </div>
              )}
              <h2 style={{ margin: '0 0 6px', color: '#fff', fontSize: 28, fontWeight: 900 }}>
                {previewBanner.TieuDe}
              </h2>
              <p style={{ margin: '0 0 6px', color: 'rgba(180,210,255,0.9)', fontSize: 15 }}>
                {previewBanner.TieuDePhu}
              </p>
              <p style={{ margin: '0 0 16px', color: 'rgba(200,200,200,0.75)', fontSize: 13 }}>
                {previewBanner.MoTa}
              </p>
              {previewBanner.GiaHienThi && (
                <p style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 900, color: '#ffd700' }}>
                  {previewBanner.GiaHienThi}
                </p>
              )}
              <div style={{
                display: 'inline-block', background: '#d70018', color: '#fff',
                padding: '10px 24px', borderRadius: 100, fontWeight: 700, fontSize: 14,
              }}>
                {previewBanner.NutText} →
              </div>
            </div>
            {previewBanner.HinhAnh && (
              <img
                src={previewBanner.HinhAnh}
                alt={previewBanner.TieuDe}
                style={{ maxHeight: 160, maxWidth: 220, objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))' }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BannerManager;
