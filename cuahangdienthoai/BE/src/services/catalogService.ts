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

  getProducts: async ({ page = 1, pageSize = 12, keyword = '', categoryId = null, brandId = null }: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Page', sql.Int, page)
        .input('PageSize', sql.Int, pageSize)
        .input('Keyword', sql.NVarChar, keyword ? keyword : null)
        .input('CategoryId', sql.Int, categoryId ? parseInt(categoryId) : null)
        .input('BrandId', sql.Int, brandId ? parseInt(brandId) : null)
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
