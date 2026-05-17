import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber,
  Switch, Select, Space, Popconfirm, message, Tag, Tooltip
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, EyeInvisibleOutlined,
  AppleOutlined, MobileOutlined, ThunderboltOutlined,
  StarOutlined, FireOutlined, TagOutlined, AppstoreOutlined,
  ShoppingOutlined, HeartOutlined, GlobalOutlined,
  CrownOutlined, RocketOutlined, GiftOutlined,
} from '@ant-design/icons';
import adminApi from '../../api/adminApi';

const { Option } = Select;

// Map icon name (lưu trong DB) -> Ant Design Icon component
export const ICON_MAP: Record<string, React.ReactNode> = {
  'AppleOutlined':       <AppleOutlined />,
  'MobileOutlined':      <MobileOutlined />,
  'ThunderboltOutlined': <ThunderboltOutlined />,
  'StarOutlined':        <StarOutlined />,
  'FireOutlined':        <FireOutlined />,
  'TagOutlined':         <TagOutlined />,
  'AppstoreOutlined':    <AppstoreOutlined />,
  'ShoppingOutlined':    <ShoppingOutlined />,
  'HeartOutlined':       <HeartOutlined />,
  'GlobalOutlined':      <GlobalOutlined />,
  'CrownOutlined':       <CrownOutlined />,
  'RocketOutlined':      <RocketOutlined />,
  'GiftOutlined':        <GiftOutlined />,
};

const ICON_OPTIONS = Object.entries(ICON_MAP).map(([key, icon]) => ({
  value: key,
  label: (
    <Space>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{key.replace('Outlined', '')}</span>
    </Space>
  ),
}));

const BrandSectionManager: React.FC = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [secRes, brandRes]: any[] = await Promise.all([
        adminApi.getDaiSanPham(),
        adminApi.getBrands(),
      ]);
      setSections(secRes.data?.daiSanPham || secRes.daiSanPham || []);
      setBrands(brandRes.data?.brands || brandRes.brands || []);
    } catch {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      soSanPhamHienThi: 4,
      thuTu: 99,
      dangHoatDong: true,
      icon: 'MobileOutlined',
    });
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue({
      tieuDe: record.TieuDe,
      maThuongHieu: record.MaThuongHieu,
      icon: record.Icon,
      duongDanXemTat: record.DuongDanXemTat,
      soSanPhamHienThi: record.SoSanPhamHienThi,
      thuTu: record.ThuTu,
      dangHoatDong: record.DangHoatDong,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await adminApi.updateDaiSanPham(editing.MaDai, values);
        message.success('Cập nhật dải sản phẩm thành công!');
      } else {
        await adminApi.createDaiSanPham(values);
        message.success('Thêm dải sản phẩm thành công!');
      }
      setModalOpen(false);
      loadData();
    } catch {
      message.error('Vui lòng kiểm tra lại thông tin.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteDaiSanPham(id);
      message.success('Đã xóa dải sản phẩm!');
      loadData();
    } catch {
      message.error('Không thể xóa dải này.');
    }
  };

  const handleToggle = async (record: any) => {
    try {
      await adminApi.updateDaiSanPham(record.MaDai, {
        tieuDe: record.TieuDe,
        maThuongHieu: record.MaThuongHieu,
        icon: record.Icon,
        duongDanXemTat: record.DuongDanXemTat,
        soSanPhamHienThi: record.SoSanPhamHienThi,
        thuTu: record.ThuTu,
        dangHoatDong: !record.DangHoatDong,
      });
      message.success(record.DangHoatDong ? 'Đã ẩn dải sản phẩm' : 'Đã hiện dải sản phẩm');
      loadData();
    } catch {
      message.error('Lỗi thay đổi trạng thái');
    }
  };

  const columns = [
    {
      title: 'Thứ Tự',
      dataIndex: 'ThuTu',
      width: 80,
      sorter: (a: any, b: any) => a.ThuTu - b.ThuTu,
      defaultSortOrder: 'ascend' as any,
    },
    {
      title: 'Tiêu Đề Dải',
      dataIndex: 'TieuDe',
      render: (text: string, record: any) => (
        <Space>
          <span style={{ fontSize: 18, color: '#1677ff' }}>
            {ICON_MAP[record.Icon] || <MobileOutlined />}
          </span>
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'Thương Hiệu',
      dataIndex: 'TenThuongHieu',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Số SP Hiển Thị',
      dataIndex: 'SoSanPhamHienThi',
      width: 130,
      render: (n: number) => <Tag>{n} sản phẩm</Tag>,
    },
    {
      title: 'Link Xem Tất Cả',
      dataIndex: 'DuongDanXemTat',
      render: (text: string) => (
        <code style={{ fontSize: 12, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>
          {text}
        </code>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'DangHoatDong',
      width: 120,
      render: (val: boolean, record: any) => (
        <Tooltip title={val ? 'Bấm để ẩn' : 'Bấm để hiện'}>
          <Tag
            color={val ? 'green' : 'default'}
            icon={val ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => handleToggle(record)}
          >
            {val ? 'Đang hiện' : 'Đã ẩn'}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Hành Động',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm
            title="Xóa dải này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.MaDai)}
            okText="Xóa" cancelText="Hủy" okType="danger"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>Quản Lý Dải Sản Phẩm Trang Chủ</h2>
          <p style={{ margin: 0, color: '#888', fontSize: 13 }}>
            Thêm, sửa, xóa hoặc bật/tắt các dải thương hiệu hiển thị trên trang chủ mà không cần sửa code.
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} size="large">
          Thêm Dải Mới
        </Button>
      </div>

      <Table
        dataSource={sections}
        columns={columns}
        rowKey="MaDai"
        loading={loading}
        pagination={false}
        bordered
      />

      <Modal
        title={editing ? 'Chỉnh Sửa Dải Sản Phẩm' : 'Thêm Dải Sản Phẩm Mới'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Lưu Thay Đổi' : 'Thêm Mới'}
        cancelText="Hủy"
        width={560}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="tieuDe" label="Tiêu Đề Hiển Thị" rules={[{ required: true, message: 'Nhập tiêu đề dải!' }]}>
            <Input placeholder="Ví dụ: iPhone, Samsung Galaxy..." />
          </Form.Item>

          <Form.Item name="maThuongHieu" label="Thương Hiệu" rules={[{ required: true, message: 'Chọn thương hiệu!' }]}>
            <Select placeholder="Chọn thương hiệu cần hiển thị">
              {brands.map((b: any) => (
                <Option key={b.MaThuongHieu} value={b.MaThuongHieu}>{b.Ten}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="icon" label="Biểu Tượng">
            <Select placeholder="Chọn icon" optionLabelProp="label">
              {ICON_OPTIONS.map(o => (
                <Option key={o.value} value={o.value} label={
                  <Space>
                    <span>{ICON_MAP[o.value]}</span>
                    <span>{o.value.replace('Outlined', '')}</span>
                  </Space>
                }>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="duongDanXemTat" label="Link Nút 'Xem Tất Cả'" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: /iphone, /samsung" />
          </Form.Item>

          <Space style={{ width: '100%' }}>
            <Form.Item name="soSanPhamHienThi" label="Số SP Hiển Thị" style={{ flex: 1 }}>
              <InputNumber min={1} max={12} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="thuTu" label="Thứ Tự (Nhỏ = Lên Đầu)" style={{ flex: 1 }}>
              <InputNumber min={1} max={999} style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item name="dangHoatDong" label="Trạng Thái" valuePropName="checked">
            <Switch checkedChildren="Đang Hiện" unCheckedChildren="Đang Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandSectionManager;
