import sql from 'mssql';
import { getConnection } from '../config/db';

export const adminService = {
  // --- THỐNG KÊ DASHBOARD ---
  getDashboardStats: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetDashboardStats');
    
    const monthlyRevenue = [
      { name: 'Tháng 1', revenue: 120000000 },
      { name: 'Tháng 2', revenue: 155000000 },
      { name: 'Tháng 3', revenue: 195000000 },
      { name: 'Tháng 4', revenue: 220000000 },
      { name: 'Tháng 5', revenue: 180000000 },
      { name: 'Tháng 6', revenue: 250000000 },
    ];
    
    return { ...result.recordset[0], monthlyRevenue };
  },

  // --- QUẢN LÝ DANH MỤC ---
  getCategories: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetCategories');
    return result.recordset;
  },
  createCategory: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Name', sql.NVarChar, data.name)
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
    return result.rowsAffected[0] > 0;
  },
  deleteCategory: async (id: number) => {
    const pool = await getConnection();
    await pool.request().input('Id', sql.Int, id).execute('sp_Admin_DeleteCategory');
    return true;
  },

  // --- QUẢN LÝ THƯƠNG HIỆU ---
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

  // --- QUẢN LÝ ĐƠN HÀNG ---
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

  // --- QUẢN LÝ THÀNH VIÊN ---
  getAllUsers: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetAllUsers');
    return result.recordset;
  },
  toggleUserLock: async (userId: string, isLocked: boolean) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('IsLocked', sql.Bit, isLocked ? 1 : 0)
      .execute('sp_Admin_ToggleUserLock');
    return result.rowsAffected[0] > 0;
  },
  changeUserRole: async (userId: string, role: string) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('Role', sql.NVarChar, role)
      .execute('sp_Admin_ChangeUserRole');
    return result.rowsAffected[0] > 0;
  },

  // --- QUẢN LÝ SẢN PHẨM ---
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

  // --- QUẢN LÝ FLASH SALE ---
  getFlashSales: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_Admin_GetFlashSales');
    return result.recordset;
  },
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
  addFlashSaleItem: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('MaFlashSale', sql.Int, data.maFlashSale)
      .input('MaSanPham', sql.UniqueIdentifier, data.maSanPham)
      .input('GiaFlashSale', sql.Decimal(18,2), data.giaFlashSale)
      .input('SoLuongGioiHan', sql.Int, data.soLuongGioiHan || 0)
      .execute('sp_Admin_AddFlashSaleItem');
    return result.recordset[0];
  },
  removeFlashSaleItem: async (id: number) => {
    const pool = await getConnection();
    await pool.request().input('MaChiTiet', sql.Int, id).execute('sp_Admin_RemoveFlashSaleItem');
    return true;
  },

  // --- QUẢN LÝ TIN TỨC ---
  getAllNews: async () => {
    const pool = await getConnection();
    // Re-use current User getter or a specific one, sp_GetTinTuc doesn't have an Admin version, it's fine.
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

  // --- QUẢN LÝ BANNER ---
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
      .input('NutText', sql.NVarChar, data.NutText || 'Xem ngay')
      .input('NutLink', sql.NVarChar, data.NutLink || '/products')
      .input('HinhAnh', sql.NVarChar, data.HinhAnh || null)
      .input('MauNen', sql.NVarChar, data.MauNen || 'linear-gradient(135deg, #0a0a1a 0%, #13131f 100%)')
      .input('TagText', sql.NVarChar, data.TagText || null)
      .input('TagIcon', sql.NVarChar, data.TagIcon || 'star')
      .input('ThuTu', sql.Int, data.ThuTu || 99)
      .input('DangHoatDong', sql.Bit, data.DangHoatDong !== false ? 1 : 0)
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

  // --- QUẢN LÝ DẢI SẢN PHẨM TRANG CHỦ ---
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
