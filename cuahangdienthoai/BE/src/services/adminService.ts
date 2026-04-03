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
  }
};
