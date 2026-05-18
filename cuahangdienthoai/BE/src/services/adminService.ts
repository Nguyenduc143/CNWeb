// ============================================================
// FILE: adminService.ts - SERVICE CHO TOÀN BỘ CMS ADMIN
// ------------------------------------------------------------
// File này gom 10 nhóm chức năng quản trị, mỗi nhóm là 1 vùng CRUD.
// Toàn bộ truy vấn DB đều đi qua Stored Procedure (SP) để:
//   - Logic phức tạp xử lý ở DB (1 round-trip thay vì nhiều)
//   - Code TypeScript ngắn gọn, dễ đọc
//   - Bảo mật: tham số được bind, chống SQL Injection
//
// Cấu trúc gọi SP với mssql:
//   pool.request()
//      .input('Param', sql.Type, value)
//      .execute('ten_sp')
//   -> result.recordset = mảng dòng đầu tiên SP trả về
//   -> result.rowsAffected[0] = số dòng đã ảnh hưởng (UPDATE/DELETE)
// ============================================================

import sql from 'mssql';
import { getConnection } from '../config/db';

export const adminService = {
  // ==========================================================
  // 1. THỐNG KÊ DASHBOARD
  // ==========================================================
  // SP trả về 1 dòng chứa nhiều con số tổng hợp
  // (tổng đơn, tổng doanh thu, sản phẩm bán chạy...)
  // ----------------------------------------------------------
  getDashboardStats: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetDashboardStats');

    // TODO: monthlyRevenue tạm hardcode để FE có dữ liệu vẽ biểu đồ.
    // Khi có data thật, thay bằng kết quả query GROUP BY MONTH từ Orders.
    const monthlyRevenue = [
      { name: 'Tháng 1', revenue: 120000000 },
      { name: 'Tháng 2', revenue: 155000000 },
      { name: 'Tháng 3', revenue: 195000000 },
      { name: 'Tháng 4', revenue: 220000000 },
      { name: 'Tháng 5', revenue: 180000000 },
      { name: 'Tháng 6', revenue: 250000000 },
    ];

    // Spread thông tin từ SP + ghép thêm biểu đồ
    return { ...result.recordset[0], monthlyRevenue };
  },

  // ==========================================================
  // 2. DANH MỤC SẢN PHẨM (CRUD)
  // ==========================================================
  getCategories: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetCategories');
    return result.recordset;
  },
  createCategory: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Name', sql.NVarChar, data.name)
        // Tự sinh slug từ name: "Điện thoại" -> "điện-thoại"
        // Lưu ý: replace đơn giản bằng dấu '-', không xử lý dấu tiếng Việt
        .input('Slug', sql.VarChar, data.name.toLowerCase().replace(/ /g, '-'))
        .execute('sp_Admin_CreateCategory');
    return result.recordset[0];
  },
  updateCategory: async (id: number, data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Id', sql.Int, id)
        .input('Name', sql.NVarChar, data.name)
        .execute('sp_Admin_UpdateCategory');
    // rowsAffected[0] = số dòng UPDATE thành công (0 = không tìm thấy id)
    return result.rowsAffected[0] > 0;
  },
  deleteCategory: async (id: number) => {
    const pool = await getConnection();
    await pool.request().input('Id', sql.Int, id).execute('sp_Admin_DeleteCategory');
    return true;
  },

  // ==========================================================
  // 3. THƯƠNG HIỆU (CRUD)
  // ==========================================================
  // Chú ý: getBrands dùng SP chung (sp_GetThuongHieu) với storefront
  // để tránh duplicate code; create/update/delete có SP admin riêng.
  // ----------------------------------------------------------
  getBrands: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_GetThuongHieu');
    return result.recordset;
  },
  createBrand: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Ten', sql.NVarChar, data.name)
        .execute('sp_Admin_CreateBrand');
    return result.recordset?.[0] || true;
  },
  updateBrand: async (id: number, data: any) => {
    const pool = await getConnection();
    await pool.request()
        .input('Id', sql.Int, id)
        .input('Ten', sql.NVarChar, data.name)
        .execute('sp_Admin_UpdateBrand');
    return true;
  },
  deleteBrand: async (id: number) => {
    const pool = await getConnection();
    await pool.request().input('Id', sql.Int, id).execute('sp_Admin_DeleteBrand');
    return true;
  },

  // ==========================================================
  // 4. ĐƠN HÀNG (Admin chỉ xem + đổi trạng thái)
  // ==========================================================
  // Status: 0=Pending, 1=Confirmed, 2=Shipped, 3=Completed, 4=Cancelled
  // ----------------------------------------------------------
  getAllOrders: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetAllOrders');
    return result.recordset;
  },
  updateOrderStatus: async (orderId: string, status: number) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('OrderId', sql.UniqueIdentifier, orderId)
      .input('Status', sql.Int, status)
      .execute('sp_Admin_UpdateOrderStatus');
    return result.rowsAffected[0] > 0;
  },

  // ==========================================================
  // 5. NGƯỜI DÙNG (Admin xem, khoá/mở khoá, đổi vai trò)
  // ==========================================================
  getAllUsers: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetAllUsers');
    return result.recordset;
  },
  toggleUserLock: async (userId: string, isLocked: boolean) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      // SQL Server kiểu Bit: 0/1, không phải true/false
      .input('IsLocked', sql.Bit, isLocked ? 1 : 0)
      .execute('sp_Admin_ToggleUserLock');
    return result.rowsAffected[0] > 0;
  },
  changeUserRole: async (userId: string, role: string) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('Role', sql.NVarChar, role)  // 'Admin' | 'Staff' | 'Customer'
      .execute('sp_Admin_ChangeUserRole');
    return result.rowsAffected[0] > 0;
  },

  // ==========================================================
  // 6. SẢN PHẨM (KHO HÀNG) - CRUD đầy đủ
  // ==========================================================
  // ID là UNIQUEIDENTIFIER (GUID), không phải INT.
  // ----------------------------------------------------------
  getAllProducts: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetAllProducts');
    return result.recordset;
  },

  createProduct: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('CategoryId', sql.Int, data.categoryId || null)
      .input('BrandId', sql.Int, data.brandId || null)
      .input('Name', sql.NVarChar, data.name)
      // Slug tự sinh từ tên - SEO friendly URL
      .input('Slug', sql.NVarChar, data.name.toLowerCase().replace(/ /g, '-'))
      .input('Description', sql.NVarChar, data.description || '')
      .input('GiaNhap', sql.Decimal(18,2), data.priceImport || 0)
      .input('GiaBan', sql.Decimal(18,2), data.priceSell)
      .input('TonKho', sql.Int, data.stock || 0)
      .input('Ram', sql.Int, data.ramGB || null)
      .input('Rom', sql.Int, data.romGB || null)
      .input('MauSac', sql.NVarChar, data.color || null)
      .input('Image1', sql.NVarChar, data.image1 || null)
      .execute('sp_Admin_CreateProduct');
    return result.recordset[0];
  },

  updateProduct: async (id: string, data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .input('CategoryId', sql.Int, data.categoryId || null)
      .input('BrandId', sql.Int, data.brandId || null)
      .input('Name', sql.NVarChar, data.name)
      .input('Description', sql.NVarChar, data.description || '')
      .input('GiaNhap', sql.Decimal(18,2), data.priceImport || 0)
      .input('GiaBan', sql.Decimal(18,2), data.priceSell)
      .input('TonKho', sql.Int, data.stock || 0)
      .input('Ram', sql.Int, data.ramGB || null)
      .input('Rom', sql.Int, data.romGB || null)
      .input('MauSac', sql.NVarChar, data.color || null)
      .input('Image1', sql.NVarChar, data.image1 || null)
      .execute('sp_Admin_UpdateProduct');
    return result.rowsAffected[0] > 0;
  },

  deleteProduct: async (id: string) => {
    const pool = await getConnection();
    await pool.request().input('Id', sql.UniqueIdentifier, id).execute('sp_Admin_DeleteProduct');
    return true;
  },

  // ==========================================================
  // 7. FLASH SALE (sự kiện + sản phẩm tham gia)
  // ==========================================================
  getFlashSales: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetFlashSales');
    return result.recordset;
  },
  // SP trả 2 recordset: [0]=sự kiện, [1]=danh sách sản phẩm trong sự kiện
  getFlashSaleDetail: async (id: number) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .execute('sp_Admin_GetFlashSaleDetail');
    const recordsets = result.recordsets as any[][];
    if (!recordsets || recordsets[0].length === 0) return null;
    return { event: recordsets[0][0], items: recordsets[1] || [] };
  },
  createFlashSale: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('TenSuKien', sql.NVarChar, data.tenSuKien)
      .input('ThoiGianBatDau', sql.DateTime2, data.thoiGianBatDau)
      .input('ThoiGianKetThuc', sql.DateTime2, data.thoiGianKetThuc)
      // Mặc định bật khi tạo (nếu data.dangHoatDong khác false thì là true)
      .input('DangHoatDong', sql.Bit, data.dangHoatDong !== false ? 1 : 0)
      .execute('sp_Admin_CreateFlashSale');
    return result.recordset[0];
  },
  updateFlashSale: async (id: number, data: any) => {
    const pool = await getConnection();
    await pool.request()
      .input('Id', sql.Int, id)
      .input('TenSuKien', sql.NVarChar, data.tenSuKien)
      .input('ThoiGianBatDau', sql.DateTime2, data.thoiGianBatDau)
      .input('ThoiGianKetThuc', sql.DateTime2, data.thoiGianKetThuc)
      .input('DangHoatDong', sql.Bit, data.dangHoatDong ? 1 : 0)
      .execute('sp_Admin_UpdateFlashSale');
    return true;
  },
  deleteFlashSale: async (id: number) => {
    const pool = await getConnection();
    await pool.request().input('Id', sql.Int, id).execute('sp_Admin_DeleteFlashSale');
    return true;
  },
  // Thêm 1 sản phẩm vào sự kiện flash sale (kèm giá ưu đãi và số lượng giới hạn)
  addFlashSaleItem: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('MaFlashSale', sql.Int, data.maFlashSale)
      .input('MaSanPham', sql.UniqueIdentifier, data.maSanPham)
      .input('GiaFlashSale', sql.Decimal(18,2), data.giaFlashSale)
      .input('SoLuongGioiHan', sql.Int, data.soLuongGioiHan || 0)
      .execute('sp_Admin_AddFlashSaleItem');
    // SP có check: giá flash phải nhỏ hơn giá bán; trả Success=0 nếu vi phạm
    return result.recordset[0];
  },
  removeFlashSaleItem: async (id: number) => {
    const pool = await getConnection();
    await pool.request().input('MaChiTiet', sql.Int, id).execute('sp_Admin_RemoveFlashSaleItem');
    return true;
  },

  // ==========================================================
  // 8. TIN TỨC (BLOG)
  // ==========================================================
  getAllNews: async () => {
    const pool = await getConnection();
    // Dùng chung SP với storefront vì admin cũng cần list giống user
    const result = await pool.request().execute('sp_GetTinTuc');
    return result.recordset;
  },
  createNews: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('TieuDe', sql.NVarChar, data.TieuDe)
        .input('TomTat', sql.NVarChar, data.TomTat)
        .input('NoiDung', sql.NVarChar, data.NoiDung)
        .input('HinhThuNho', sql.NVarChar, data.HinhThuNho || null)
        // TrangThai: 1=Hiện, 0=Ẩn (mặc định 1 nếu không truyền hoặc truyền true)
        .input('TrangThai', sql.Bit, data.TrangThai === false ? 0 : 1)
        .execute('sp_Admin_CreateNews');
    return result.recordset?.[0] || true;
  },
  updateNews: async (id: number, data: any) => {
    const pool = await getConnection();
    await pool.request()
        .input('Id', sql.Int, id)
        .input('TieuDe', sql.NVarChar, data.TieuDe)
        .input('TomTat', sql.NVarChar, data.TomTat)
        .input('NoiDung', sql.NVarChar, data.NoiDung)
        .input('HinhThuNho', sql.NVarChar, data.HinhThuNho || null)
        .input('TrangThai', sql.Bit, data.TrangThai === false ? 0 : 1)
        .execute('sp_Admin_UpdateNews');
    return true;
  },
  deleteNews: async (id: number) => {
    const pool = await getConnection();
    await pool.request()
        .input('Id', sql.Int, id)
        .execute('sp_Admin_DeleteNews');
    return true;
  },

  // ==========================================================
  // 9. BANNER (Slider hero trang chủ)
  // ==========================================================
  // Khác các module khác: Banner dùng QUERY TRỰC TIẾP (không SP)
  // vì cấu trúc đơn giản và không có business logic phức tạp.
  // ----------------------------------------------------------
  getAllBanners: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(
      `SELECT MaBanner, TieuDe, TieuDePhu, MoTa, GiaHienThi, NutText, NutLink,
              HinhAnh, MauNen, TagText, TagIcon, ThuTu, DangHoatDong
       FROM Banner ORDER BY ThuTu ASC`
    );
    return result.recordset;
  },

  createBanner: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('TieuDe', sql.NVarChar, data.TieuDe)
      .input('TieuDePhu', sql.NVarChar, data.TieuDePhu || null)
      .input('MoTa', sql.NVarChar, data.MoTa || null)
      .input('GiaHienThi', sql.NVarChar, data.GiaHienThi || null)
      // Các giá trị mặc định để banner không bị "trống" trên giao diện
      .input('NutText', sql.NVarChar, data.NutText || 'Xem ngay')
      .input('NutLink', sql.NVarChar, data.NutLink || '/products')
      .input('HinhAnh', sql.NVarChar, data.HinhAnh || null)
      .input('MauNen', sql.NVarChar, data.MauNen || 'linear-gradient(135deg, #0a0a1a 0%, #13131f 100%)')
      .input('TagText', sql.NVarChar, data.TagText || null)
      .input('TagIcon', sql.NVarChar, data.TagIcon || 'star')
      .input('ThuTu', sql.Int, data.ThuTu || 99)
      .input('DangHoatDong', sql.Bit, data.DangHoatDong !== false ? 1 : 0)
      // OUTPUT INSERTED.* trả về dòng vừa INSERT để FE có ngay MaBanner
      .query(`INSERT INTO Banner (TieuDe, TieuDePhu, MoTa, GiaHienThi, NutText, NutLink, HinhAnh, MauNen, TagText, TagIcon, ThuTu, DangHoatDong)
              OUTPUT INSERTED.*
              VALUES (@TieuDe, @TieuDePhu, @MoTa, @GiaHienThi, @NutText, @NutLink, @HinhAnh, @MauNen, @TagText, @TagIcon, @ThuTu, @DangHoatDong)`);
    return result.recordset[0];
  },

  updateBanner: async (id: number, data: any) => {
    const pool = await getConnection();
    await pool.request()
      .input('Id', sql.Int, id)
      .input('TieuDe', sql.NVarChar, data.TieuDe)
      .input('TieuDePhu', sql.NVarChar, data.TieuDePhu || null)
      .input('MoTa', sql.NVarChar, data.MoTa || null)
      .input('GiaHienThi', sql.NVarChar, data.GiaHienThi || null)
      .input('NutText', sql.NVarChar, data.NutText || 'Xem ngay')
      .input('NutLink', sql.NVarChar, data.NutLink || '/products')
      .input('HinhAnh', sql.NVarChar, data.HinhAnh || null)
      .input('MauNen', sql.NVarChar, data.MauNen || 'linear-gradient(135deg, #0a0a1a 0%, #13131f 100%)')
      .input('TagText', sql.NVarChar, data.TagText || null)
      .input('TagIcon', sql.NVarChar, data.TagIcon || 'star')
      .input('ThuTu', sql.Int, data.ThuTu || 99)
      .input('DangHoatDong', sql.Bit, data.DangHoatDong ? 1 : 0)
      .query(`UPDATE Banner SET
                TieuDe=@TieuDe, TieuDePhu=@TieuDePhu, MoTa=@MoTa,
                GiaHienThi=@GiaHienThi, NutText=@NutText, NutLink=@NutLink,
                HinhAnh=@HinhAnh, MauNen=@MauNen, TagText=@TagText,
                TagIcon=@TagIcon, ThuTu=@ThuTu, DangHoatDong=@DangHoatDong
              WHERE MaBanner=@Id`);
    return true;
  },

  deleteBanner: async (id: number) => {
    const pool = await getConnection();
    await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Banner WHERE MaBanner = @Id');
    return true;
  },

  // ==========================================================
  // 10. DẢI SẢN PHẨM TRANG CHỦ
  // ==========================================================
  // Mỗi "dải" = 1 row sản phẩm theo brand trên trang chủ.
  // Ví dụ: row "iPhone nổi bật" gắn với BrandId=1, hiển thị 4 SP.
  // ----------------------------------------------------------
  getDaiSanPham: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetDaiSanPham');
    return result.recordset;
  },
  createDaiSanPham: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('TieuDe', sql.NVarChar, data.tieuDe)
      .input('MaThuongHieu', sql.Int, data.maThuongHieu)
      .input('Icon', sql.NVarChar, data.icon || 'phone-portrait-outline')
      .input('DuongDanXemTat', sql.NVarChar, data.duongDanXemTat || '/products')
      .input('SoSanPhamHienThi', sql.Int, data.soSanPhamHienThi || 4)
      .input('ThuTu', sql.Int, data.thuTu || 99)
      .input('DangHoatDong', sql.Bit, data.dangHoatDong !== false ? 1 : 0)
      .execute('sp_Admin_CreateDaiSanPham');
    return result.recordset[0];
  },
  updateDaiSanPham: async (id: number, data: any) => {
    const pool = await getConnection();
    await pool.request()
      .input('Id', sql.Int, id)
      .input('TieuDe', sql.NVarChar, data.tieuDe)
      .input('MaThuongHieu', sql.Int, data.maThuongHieu)
      .input('Icon', sql.NVarChar, data.icon || 'phone-portrait-outline')
      .input('DuongDanXemTat', sql.NVarChar, data.duongDanXemTat || '/products')
      .input('SoSanPhamHienThi', sql.Int, data.soSanPhamHienThi || 4)
      .input('ThuTu', sql.Int, data.thuTu || 99)
      .input('DangHoatDong', sql.Bit, data.dangHoatDong ? 1 : 0)
      .execute('sp_Admin_UpdateDaiSanPham');
    return true;
  },
  deleteDaiSanPham: async (id: number) => {
    const pool = await getConnection();
    await pool.request().input('Id', sql.Int, id).execute('sp_Admin_DeleteDaiSanPham');
    return true;
  },
};
