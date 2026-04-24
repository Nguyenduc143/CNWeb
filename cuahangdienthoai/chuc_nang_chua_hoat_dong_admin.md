# Các Chức Năng Quản Trị (Admin) Chưa Hoạt Động / Thiếu Sót

Dựa trên quá trình kiểm tra toàn diện mã nguồn Frontend ([AdminDashboard.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/admin/AdminDashboard.tsx), [ProductManager.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/admin/ProductManager.tsx), v.v.) và Backend ([adminRoutes.ts](file:///d:/CNWeb/cuahangdienthoai/BE/src/routes/adminRoutes.ts), [adminController.ts](file:///d:/CNWeb/cuahangdienthoai/BE/src/controllers/adminController.ts)), hệ thống đang **thiếu** các cụm tính năng sau ở mảng Quản Trị (Admin):

## 1. Quản lý Tin Tức (News / Blog Manager)
- **Tình trạng:** Hoàn toàn trống.
- **Chi tiết:** Người dùng (Client) đã có trang đọc Tin tức ([NewsPage.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/NewsPage.tsx)) kéo dữ liệu từ bảng `TinTuc`. Tuy nhiên bên giao diện Admin chưa hề thiết kế trang `NewsManager.tsx` cũng như chưa viết Endpoints trong [adminRoutes.ts](file:///d:/CNWeb/cuahangdienthoai/BE/src/routes/adminRoutes.ts) để Quản trị viên Thêm, Sửa, Xóa bài viết. 

## 2. Quản lý Thương Hiệu (Brand Manager)
- **Tình trạng:** Chưa phát triển UI & API.
- **Chi tiết:** Đã có giao diện Quản lý Danh mục (Categories), nhưng bảng dữ liệu `ThuongHieu` (Brands) - dùng để lọc sản phẩm Apple, Samsung - lại không có công cụ Quản trị. Admin hiện không thể thêm thương hiệu mới hay sửa Logo.

## 3. Quản lý Đánh Giá (Review Manager)
- **Tình trạng:** Chưa phát triển UI & API.
- **Chi tiết:** Bảng CSDL có hỗ trợ `DanhGia` (Ratings/Reviews). Cần có một giao diện bảng để Admin theo dõi đánh giá của khách hàng, thực hiện ẩn/xóa (mod) với đánh giá rác, hoặc bổ sung tính năng "Shop phản hồi đánh giá".

## 4. Quản lý Hình Ảnh Sản Phẩm (Nâng cao)
- **Tình trạng:** Mới chỉ hỗ trợ 1 Ảnh đại diện (Thumb).
- **Chi tiết:** Form chỉnh sửa nội dung trong [ProductManager.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/admin/ProductManager.tsx) hiện chỉ cho phép nhập `Image1`. Hệ thống Database bảng `AnhSanPham` vốn lưu được nhiều ảnh (Gallery). Cần phải cải tiến [Modal](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/admin/CategoryManager.tsx#31-41) trong ProductManager cho phép Upload/Nhập Link một chuỗi List các ảnh.

## 5. Xuất báo cáo (Export Excel / CSV)
- **Tình trạng:** Tính năng rỗng (mock/thiếu).
- **Chi tiết:** Thường các hệ thống Dashboard thương mại điện tử cần chức năng "Xuất Excel" doanh thu hoặc "Xuất tệp CSV Đơn hàng" ra ngoài. Hiện tại UI [AdminDashboard](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/admin/AdminDashboard.tsx#8-119) chỉ vẽ biểu đồ thuần Recharts.

---

**Khuyến nghị:**
Chúng ta có thể ưu tiên làm **Quản lý Tin tức** và **Quản lý Thương Hiệu** trước vì nó tác động mạnh mẽ nhất đến giao diện Content của khách hàng bên ngoài.
