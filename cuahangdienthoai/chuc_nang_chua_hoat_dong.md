# Danh sách các chức năng chưa hoạt động (User Side)

Qua quá trình kiểm tra các file mã nguồn Frontend và Backend, dưới đây là thống kê các chức năng bên phía người dùng (User Side) đang hiển thị hoặc còn thiếu logic xử lý và chưa hoạt động hoàn chỉnh:

## 1. Authentication (Xác thực & Tài khoản)
- **Quên mật khẩu (Forgot Password):** Tại trang [LoginPage.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/auth/LoginPage.tsx), nút "Quên mật khẩu?" đang dùng thẻ `<Link to="#">` chưa trỏ đi đâu, backend cũng chưa có API xử lý quên mật khẩu (gửi email reset).
- **Ghi nhớ đăng nhập (Remember me):** Checkbox "Ghi nhớ tôi" ở form đăng nhập hiện chỉ là giao diện, chưa có logic set cookie thời gian dài hay lưu trạng thái remember vào logic xử lý.
- **Đổi mật khẩu tài khoản:** Trong trang hồ sơ [ProfilePage.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/user/ProfilePage.tsx) mới chỉ hỗ trợ cập nhật thay đổi "Họ tên" và "SĐT", chưa có tính năng hoặc form nào để kích hoạt "Thay đổi mật khẩu". Backend [authController.ts](file:///d:/CNWeb/cuahangdienthoai/BE/src/controllers/authController.ts) cũng chưa có endpoint `/me/change-password`.

## 2. Giao diện Cửa hàng (Storefront) & Các trang
- **Trang Tin Tức (Blog / News):** Trong [Header.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/components/layout/Header.tsx) có gắn link điều hướng tới `/tin-tuc`. Tuy nhiên trong file cấu hình Router [App.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/App.tsx) chưa hề được định nghĩa trang này, dẫn tới việc người dùng click vào sẽ bị điều hướng sang trang `NotFoundPage` (404).
- **Đánh giá & Bình luận sản phẩm (Reviews/Ratings):** Việc xem chi tiết sản phẩm chưa có khu vực để người dùng thực hiện đánh giá (Review) sản phẩm hay xếp hạng (Rating) bằng sao sau khi mua hàng.

## 3. Tìm kiếm & Lọc Sản phẩm
- **Bộ lọc sản phẩm nâng cao (Advanced Filters):** Backend API [catalogController.ts](file:///d:/CNWeb/cuahangdienthoai/BE/src/controllers/catalogController.ts) đã khởi tạo lấy ra danh sách nhưng chưa hề khai báo xử lý các param như Khoảng giá (minPrice, maxPrice), đặc tính (RAM/ROM) hay cơ chế sắp xếp (Sort by Price Asc/Desc). Trang [ProductListPage.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/ProductListPage.tsx) cũng chưa vẽ giao diện bộ lọc này.
- **Phân trang (Pagination):** Mặc dù BE trả về block `pagination: { totalPages, totalCount... }`, nhưng FE ở trang xem danh sách sản phẩm [ProductListPage.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/ProductListPage.tsx) hoàn toàn gọi cứng với `pageSize: 20` và chưa thiết kế nút phân trang (Next, Prev, các số trang) bên dưới danh sách.

## 4. Quản lý Đơn hàng (Orders) & Thanh toán (Checkout)
- **Hủy đơn hàng:** Tại giao diện Lịch sử mua hàng ([ProfilePage.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/user/ProfilePage.tsx)), người dùng chỉ xem được trạng thái, không có nút để yêu cầu "Hủy đơn hàng" khi đơn hàng đang ở trạng thái `Chờ xử lý`.
- **Thanh toán trực tuyến (VNPAY / Momo):** Flow thanh toán ở [CheckoutPage.tsx](file:///d:/CNWeb/cuahangdienthoai/FE/src/pages/checkout/CheckoutPage.tsx) hiện tại chỉ đang chốt lưu lại dạng "Thanh toán nội bộ/COD" (createOrder), chưa có module cấu hình cổng thanh toán trực tuyến.
