// ============================================================
// FILE: BrandSectionManager.tsx
// TRANG QUẢN LÝ "DẢI SẢN PHẨM TRANG CHỦ" (Admin CMS)


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

// ============================================================
// ICON_MAP: Bảng tra cứu icon
// ------------------------------------------------------------
// DB chỉ lưu TÊN icon (string) thay vì component.
// Khi render, ta map từ tên -> component thực sự để hiển thị.
// Cách này gọn cho DB và linh hoạt khi muốn thêm icon mới.
// ============================================================
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

// ICON_OPTIONS: Mảng options cho Select - mỗi option có icon + tên.
// Object.entries biến { key: value } -> [[key, value], ...] để map.
// label.replace('Outlined', '') = bỏ hậu tố "Outlined" cho gọn:
//   AppleOutlined -> Apple, MobileOutlined -> Mobile...
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
  // ------------------------------------------------------------
  // STATE QUẢN LÝ
  // ------------------------------------------------------------
  const [sections, setSections] = useState<any[]>([]);    // Danh sách "dải" lấy từ DB
  const [brands, setBrands] = useState<any[]>([]);        // Danh sách thương hiệu (cho dropdown)
  const [loading, setLoading] = useState(false);          // Loading state cho table
  const [modalOpen, setModalOpen] = useState(false);      // Đóng/mở modal CRUD
  const [editing, setEditing] = useState<any>(null);      // null = thêm mới; object = đang sửa

  // form instance của AntD - cho phép gọi setFieldsValue, validateFields...
  const [form] = Form.useForm();

  // ------------------------------------------------------------
  // LOAD DỮ LIỆU: gọi 2 API SONG SONG bằng Promise.all
  // -> Nhanh hơn gọi tuần tự (cùng đợi response chậm nhất, không cộng dồn)
  // ------------------------------------------------------------
  const loadData = async () => {
    setLoading(true);
    try {
      const [secRes, brandRes]: any[] = await Promise.all([
        adminApi.getDaiSanPham(),
        adminApi.getBrands(),
      ]);
      // BE có thể trả 2 dạng response (cũ/mới) -> dùng OR fallback để chắc chắn lấy được
      setSections(secRes.data?.daiSanPham || secRes.daiSanPham || []);
      setBrands(brandRes.data?.brands || brandRes.brands || []);
    } catch {
      message.error('Lỗi tải dữ liệu');
    } finally {
      // finally luôn chạy dù success hay fail -> đảm bảo loading tắt
      setLoading(false);
    }
  };

  // Chạy loadData() đúng 1 lần khi component mount (mảng deps rỗng)
  useEffect(() => { loadData(); }, []);

  // ------------------------------------------------------------
  // HANDLER: Mở modal THÊM MỚI
  // -> reset form + đặt giá trị MẶC ĐỊNH cho các trường
  // ------------------------------------------------------------
  const openCreate = () => {
    setEditing(null);          // null = chế độ thêm mới
    form.resetFields();
    form.setFieldsValue({
      soSanPhamHienThi: 4,     // Mặc định hiện 4 SP
      thuTu: 99,               // Đẩy xuống cuối; user tự set lại nếu muốn
      dangHoatDong: true,      // Bật ngay khi tạo
      icon: 'MobileOutlined',  // Icon mặc định: điện thoại
    });
    setModalOpen(true);
  };

  // ------------------------------------------------------------
  // HANDLER: Mở modal CHỈNH SỬA
  // -> nạp data của row đang sửa vào form
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // HANDLER: Lưu form (cả Thêm mới lẫn Cập nhật)
  // ------------------------------------------------------------
  const handleSave = async () => {
    try {
      // validateFields() ném lỗi nếu trường có rules required chưa nhập
      const values = await form.validateFields();

      // Phân biệt Thêm/Sửa dựa vào state editing
      if (editing) {
        await adminApi.updateDaiSanPham(editing.MaDai, values);
        message.success('Cập nhật dải sản phẩm thành công!');
      } else {
        await adminApi.createDaiSanPham(values);
        message.success('Thêm dải sản phẩm thành công!');
      }
      setModalOpen(false);
      loadData();   // Tải lại bảng để hiển thị data mới
    } catch {
      message.error('Vui lòng kiểm tra lại thông tin.');
    }
  };

  // ------------------------------------------------------------
  // HANDLER: Xoá 1 dải (đã có Popconfirm xác nhận)
  // ------------------------------------------------------------
  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteDaiSanPham(id);
      message.success('Đã xóa dải sản phẩm!');
      loadData();
    } catch {
      message.error('Không thể xóa dải này.');
    }
  };

  // ------------------------------------------------------------
  // HANDLER: Toggle nhanh trạng thái Hiện/Ẩn
  // -> Click vào Tag trên bảng là đảo state (không cần mở modal)
  // -> Phải gửi nguyên bộ field (BE update theo full payload)
  // ------------------------------------------------------------
  const handleToggle = async (record: any) => {
    try {
      await adminApi.updateDaiSanPham(record.MaDai, {
        tieuDe: record.TieuDe,
        maThuongHieu: record.MaThuongHieu,
        icon: record.Icon,
        duongDanXemTat: record.DuongDanXemTat,
        soSanPhamHienThi: record.SoSanPhamHienThi,
        thuTu: record.ThuTu,
        dangHoatDong: !record.DangHoatDong,  // Đảo trạng thái
      });
      message.success(record.DangHoatDong ? 'Đã ẩn dải sản phẩm' : 'Đã hiện dải sản phẩm');
      loadData();
    } catch {
      message.error('Lỗi thay đổi trạng thái');
    }
  };

  // ------------------------------------------------------------
  // CẤU HÌNH CỘT CỦA BẢNG
  // ------------------------------------------------------------
  const columns = [
    {
      title: 'Thứ Tự',
      dataIndex: 'ThuTu',
      width: 80,
      // Cho phép sort cột này (nhấp header để đổi chiều)
      sorter: (a: any, b: any) => a.ThuTu - b.ThuTu,
      defaultSortOrder: 'ascend' as any,   // Mặc định sort tăng dần
    },
    {
      title: 'Tiêu Đề Dải',
      dataIndex: 'TieuDe',
      // render() = custom UI cho cell, kết hợp icon + text
      render: (text: string, record: any) => (
        <Space>
          <span style={{ fontSize: 18, color: '#1677ff' }}>
            {/* Lookup icon từ map; fallback nếu icon không tồn tại */}
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
        // Hiển thị URL dạng code/chip để thấy rõ là path
        <code style={{ fontSize: 12, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>
          {text}
        </code>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'DangHoatDong',
      width: 120,
      // Tag có cursor:pointer + onClick = toggle nhanh không cần modal
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
      // 2 nút: Sửa + Xoá (Xoá có Popconfirm xác nhận)
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

  // ------------------------------------------------------------
  // RENDER GIAO DIỆN
  // ------------------------------------------------------------
  return (
    <div>
      {/* Header trang: tiêu đề + nút Thêm Mới */}
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

      {/* Bảng danh sách các dải */}
      <Table
        dataSource={sections}
        columns={columns}
        rowKey="MaDai"          // Key duy nhất cho mỗi row (cần để React tối ưu render)
        loading={loading}
        pagination={false}      // Không phân trang vì số dải thường ít (<10)
        bordered
      />

      {/* Modal CRUD: dùng chung cho cả Thêm và Sửa */}
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
          {/* Tiêu đề */}
          <Form.Item name="tieuDe" label="Tiêu Đề Hiển Thị" rules={[{ required: true, message: 'Nhập tiêu đề dải!' }]}>
            <Input placeholder="Ví dụ: iPhone, Samsung Galaxy..." />
          </Form.Item>

          {/* Chọn thương hiệu - lấy từ state brands đã load */}
          <Form.Item name="maThuongHieu" label="Thương Hiệu" rules={[{ required: true, message: 'Chọn thương hiệu!' }]}>
            <Select placeholder="Chọn thương hiệu cần hiển thị">
              {brands.map((b: any) => (
                <Option key={b.MaThuongHieu} value={b.MaThuongHieu}>{b.Ten}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* Chọn icon từ ICON_MAP - hiển thị preview icon ngay trong dropdown */}
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

          {/* Đường dẫn nút "Xem tất cả" của dải này */}
          <Form.Item name="duongDanXemTat" label="Link Nút 'Xem Tất Cả'" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: /iphone, /samsung" />
          </Form.Item>

          {/* 2 trường số nằm ngang nhau */}
          <Space style={{ width: '100%' }}>
            <Form.Item name="soSanPhamHienThi" label="Số SP Hiển Thị" style={{ flex: 1 }}>
              <InputNumber min={1} max={12} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="thuTu" label="Thứ Tự (Nhỏ = Lên Đầu)" style={{ flex: 1 }}>
              <InputNumber min={1} max={999} style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          {/* Switch trạng thái - valuePropName="checked" vì Switch dùng prop "checked" thay vì "value" */}
          <Form.Item name="dangHoatDong" label="Trạng Thái" valuePropName="checked">
            <Switch checkedChildren="Đang Hiện" unCheckedChildren="Đang Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandSectionManager;
