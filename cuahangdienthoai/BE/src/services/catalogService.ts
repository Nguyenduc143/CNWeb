

import sql from 'mssql';
import { getConnection } from '../config/db';

export const catalogService = {
 
  // DANH MỤC SẢN PHẨM

  getCategories: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_GetCategories');
    return result.recordset;  // recordset = mảng các bản ghi DB trả về
  },

  
  // THƯƠNG HIỆU
  
  getBrands: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_GetBrands');
    return result.recordset;
  },

 
  // SẢN PHẨM CÓ FILTER + PHÂN TRANG
  

 
  getProducts: async ({ page = 1, pageSize = 12, keyword = '', categoryId = null, brandId = null, minPrice = null, maxPrice = null, sortBy = null }: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Page', sql.Int, page)
        .input('PageSize', sql.Int, pageSize)
        .input('Keyword', sql.NVarChar, keyword ? keyword : null)
        .input('CategoryId', sql.Int, categoryId ? parseInt(categoryId) : null)
        .input('BrandId', sql.Int, brandId ? parseInt(brandId) : null)
        .input('MinPrice', sql.Decimal(18,2), minPrice ? parseFloat(minPrice) : null)
        .input('MaxPrice', sql.Decimal(18,2), maxPrice ? parseFloat(maxPrice) : null)
        .input('SortMode', sql.NVarChar(50), sortBy ? sortBy : null)
        .execute('sp_GetProducts');

    // TotalCount nằm chung ở dòng đầu tiên -> tách ra để gửi về FE riêng
    const rows = result.recordset;
    let totalCount = 0;
    if (rows.length > 0) {
        totalCount = rows[0].TotalCount;
    }

    // Bóc TotalCount khỏi mỗi sản phẩm để response gọn
    const products = rows.map((r: any) => {
        const { TotalCount, ...rest } = r;
        return rest;
    });

    return { products, totalCount };
  },

  
  // FLASH SALE ĐANG CHẠY

  // SP trả về 2 recordset:
  //   recordset[0]: thông tin sự kiện FlashSale (1 dòng)
  //   recordset[1]: danh sách sản phẩm tham gia (N dòng)
  
  getActiveFlashSale: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_GetActiveFlashSale');

    const recordsets = result.recordsets as any[];
    // Không có flash sale đang chạy -> trả null cho controller
    if (!recordsets || recordsets.length < 2 || recordsets[0].length === 0 || recordsets[0][0].MaFlashSale === null) {
      return null;
    }

    const event = recordsets[0][0];
    const items = recordsets[1] || [];
    return { event, items };
  },

  
  // BANNER ĐANG HIỂN THỊ
  
  // Đây là endpoint duy nhất viết query thẳng (không qua SP),
  // vì logic quá đơn giản.
  
  getBanners: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(
      `SELECT MaBanner, TieuDe, TieuDePhu, MoTa, GiaHienThi, NutText, NutLink, HinhAnh, MauNen, TagText, TagIcon, ThuTu
       FROM Banner
       WHERE DangHoatDong = 1
       ORDER BY ThuTu ASC`
    );
    return result.recordset;
  },

  
  // CHI TIẾT SẢN PHẨM THEO SLUG
  
  // SP trả 2 recordset:
  //   [0]: thông tin chi tiết sản phẩm
  //   [1]: mảng ảnh sản phẩm (1-N)
  // -> Service ghép lại thành 1 object có trường Images bên trong.
  
  getProductBySlug: async (slug: string) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Slug', sql.NVarChar, slug)
        .execute('sp_GetProductBySlug');

    const recordsets = result.recordsets as any[];
    const productInfo = recordsets[0];
    const imagesInfo = recordsets[1];

    if (productInfo.length === 0) return null;

    const product = productInfo[0];
    product.Images = imagesInfo;  // Nhồi mảng ảnh vào object để FE dùng 1 lần

    return product;
  },

  
  // DẢI SẢN PHẨM TRANG CHỦ (theo thương hiệu)
  
  getDaiSanPhamActive: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_GetDaiSanPhamActive');
    return result.recordset;
  }
};
