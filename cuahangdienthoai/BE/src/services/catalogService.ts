import sql from 'mssql';
import { getConnection } from '../config/db';

export const catalogService = {
  getCategories: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_GetCategories');
    return result.recordset;
  },

  getBrands: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_GetBrands');
    return result.recordset;
  },

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
    
    // TotalCount nằm chung ở dòng đầu tiên của kết quả trả về
    const rows = result.recordset;
    let totalCount = 0;
    if (rows.length > 0) {
        totalCount = rows[0].TotalCount;
    }
    
    // Gỡ TotalCount ra khỏi mảng dữ liệu để trả thẳng về object meta riêng
    const products = rows.map((r: any) => {
        const { TotalCount, ...rest } = r;
        return rest;
    });

    return { products, totalCount };
  },

  getActiveFlashSale: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_GetActiveFlashSale');

    const recordsets = result.recordsets as any[];
    // Nếu không có flash sale nào
    if (!recordsets || recordsets.length < 2 || recordsets[0].length === 0 || recordsets[0][0].MaFlashSale === null) {
      return null;
    }

    const event = recordsets[0][0];
    const items = recordsets[1] || [];
    return { event, items };
  },

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

  getProductBySlug: async (slug: string) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Slug', sql.NVarChar, slug)
        .execute('sp_GetProductBySlug');

    // Chú ý: SP này trả về 2 kết quả recordset (1 là Prod, 2 là Mảng Hình ảnh)
    const recordsets = result.recordsets as any[];
    const productInfo = recordsets[0];
    const imagesInfo = recordsets[1];

    if (productInfo.length === 0) return null;

    const product = productInfo[0];
    product.Images = imagesInfo; // Nhồi thêm mảng ảnh vào json

    return product;
  }
};
