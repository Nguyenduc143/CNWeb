# Thiết Kế Kiến Trúc Backend Node.js Tổng Hợp (Đã bổ sung Admin Panel)

## Mảng API 1: Auth (Xác thực người dùng)
- `POST /api/auth/login` (Nhận Token bảo mật)
- `POST /api/auth/register` (Tạo tài khoản khách. Khách hàng thông thường)
- `GET /api/auth/profile` (Lấy dữ liệu phiên bản thân)

## Mảng API 2: Catalog (Quản lý Hàng hóa cho FE Khách Hàng)
- `GET /api/categories` & `GET /api/brands`
- `GET /api/products` (Data lưới phân trang)
- `GET /api/products/:slug` (Data trang chi tiết)

## Mảng API 3: Checkout (Thanh toán & Đơn hàng)
- `GET/POST /api/user/addresses`
- `POST /api/orders` (Gửi hóa đơn mua)
- `GET /api/orders/history` (Khách tự xem)

---

## 🔒 Quản Trị Hệ Thống Toàn Diện (Super Admin & Staff)
Toàn bộ API bên dưới yêu cầu Middleware chặn quyền (Phải đăng nhập bằng tài khoản Roles = `Admin` hoặc `Staff`). Phục vụ trọn gói cho hệ thống CMS Backend FE.

### Quản lý Sản Phẩm / Kho Hàng / Cấu hình
- **Khởi tạo dữ liệu nguồn:**
  - `POST/PUT/DELETE /api/admin/categories` (Tạo mới, Sửa tên Category)
  - `POST/PUT/DELETE /api/admin/brands` (Tạo thương hiệu mới)
- **Quản lý Hàng Hóa Cốt Lõi:**
  - `POST /api/admin/products` (Up sản phẩm mới kèm Hình ảnh `ProductImages`)
  - `PUT /api/admin/products/:id` (Chỉnh sửa bảng giá, cấu hình RAM/ROM)
  - `DELETE /api/admin/products/:id` (Chuyển trạng thái `IsActive = false`)
- **Quản lý Tồn Kho & Nhập Kho:**
  - `POST /api/admin/inventory/import` (Nhập thêm hàng hóa `QtyChange` từ nhà cung cấp)

### Quản lý Bán Hàng (Sales)
- **Quản lý Đơn Online (`Orders`)**:
  - `GET /api/admin/orders` (Xem toàn cảnh đơn hàng mọi khách)
  - `PUT /api/admin/orders/:id/status` (Đổi Status đơn hàng: Đang giao, Hủy, Đã nhận tiền)
- **POS Bán Tại Quầy (`Invoices`)**:
  - `POST /api/admin/invoices` (Phần mềm POS tính tiền quét mã vạch cho khách mua trực tiếp)

### Hệ thống & Bán Hàng Dashboard
- **Quản trị User & Nhân sự**:
  - `GET /api/admin/users` (Xem danh sách toàn bộ Users)
  - `PUT /api/admin/users/:id/role` (Phong quyền cho một tài khoản thường lên làm Trưởng phòng `Admin` hoặc `Nhân viên`)
- **Dashboard API (Báo Cáo)**:
  - `GET /api/admin/dashboard/stats` (Tính Doanh thu, Đơn mới trong ngày, Hàng sắp hết hạn sử dụng/hết kho)
