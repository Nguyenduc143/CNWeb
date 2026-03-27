import sql from 'mssql';
import { getConnection } from '../config/db';

export const adminService = {
  // --- THỐNG KÊ DASHBOARD ---
  getDashboardStats: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        (SELECT SUM(Total) FROM Orders WHERE Status = 0) as Revenue,
        (SELECT count(*) FROM Orders WHERE Status = 0) as PendingOrders,
        (SELECT count(*) FROM Products WHERE Stock > 0) as ActiveProducts,
        (SELECT count(*) FROM Users WHERE Role = 'Customer') as TotalCustomers
    `);
    return result.recordset[0];
  },

  // --- QUẢN LÝ SẢN PHẨM ---
  getAllProducts: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT P.*, P.Name AS ProductName, C.Name AS CategoryName, B.Name AS BrandName,
             (SELECT TOP 1 ImageUrl FROM ProductImages PI WHERE PI.ProductId = P.ProductId AND PI.SortOrder=0) AS Image1
      FROM Products P
      LEFT JOIN Categories C ON P.CategoryId = C.CategoryId
      LEFT JOIN Brands B ON P.BrandId = B.BrandId
      ORDER BY P.CreatedAt DESC
    `);
    return result.recordset;
  },

  createProduct: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('CategoryId', sql.Int, data.categoryId || null)
      .input('BrandId', sql.Int, data.brandId || null)
      .input('Name', sql.NVarChar, data.name)
      .input('Slug', sql.NVarChar, data.name.toLowerCase().replace(/ /g, '-')) // basic slug
      .input('Description', sql.NVarChar, data.description || '')
      .input('PriceImport', sql.Decimal(18,2), data.priceImport || 0)
      .input('PriceSell', sql.Decimal(18,2), data.priceSell)
      .input('Stock', sql.Int, data.stock || 0)
      .input('RamGB', sql.Int, data.ramGB || null)
      .input('RomGB', sql.Int, data.romGB || null)
      .input('Color', sql.NVarChar, data.color || null)
      .input('Image1', sql.NVarChar, data.image1 || null)
      .query(`
        DECLARE @NewId UNIQUEIDENTIFIER = NEWID();
        INSERT INTO Products (ProductId, CategoryId, BrandId, Name, Slug, Description, PriceImport, PriceSell, Stock, RamGB, RomGB, Color, CreatedAt, UpdatedAt)
        VALUES (@NewId, @CategoryId, @BrandId, @Name, @Slug, @Description, @PriceImport, @PriceSell, @Stock, @RamGB, @RomGB, @Color, GETDATE(), GETDATE());
        
        IF @Image1 IS NOT NULL
        BEGIN
           INSERT INTO ProductImages (ProductId, ImageUrl, SortOrder) VALUES (@NewId, @Image1, 0);
        END
        
        SELECT @NewId AS ProductId;
      `);
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
      .input('PriceImport', sql.Decimal(18,2), data.priceImport || 0)
      .input('PriceSell', sql.Decimal(18,2), data.priceSell)
      .input('Stock', sql.Int, data.stock || 0)
      .input('RamGB', sql.Int, data.ramGB || null)
      .input('RomGB', sql.Int, data.romGB || null)
      .input('Color', sql.NVarChar, data.color || null)
      .input('Image1', sql.NVarChar, data.image1 || null)
      .query(`
        UPDATE Products SET
          CategoryId = @CategoryId, BrandId = @BrandId, Name = @Name, Description = @Description,
          PriceImport = @PriceImport, PriceSell = @PriceSell, Stock = @Stock,
          RamGB = @RamGB, RomGB = @RomGB, Color = @Color, UpdatedAt = GETDATE()
        WHERE ProductId = @Id;

        IF @Image1 IS NOT NULL
        BEGIN
           DELETE FROM ProductImages WHERE ProductId = @Id;
           INSERT INTO ProductImages (ProductId, ImageUrl, SortOrder) VALUES (@Id, @Image1, 0);
        END
      `);
    return result.rowsAffected[0] > 0;
  },

  deleteProduct: async (id: string) => {
    const pool = await getConnection();
    // Cần xóa reference an toàn
    const request = pool.request().input('Id', sql.UniqueIdentifier, id);
    await request.query(`DELETE FROM ProductImages WHERE ProductId = @Id`);
    await request.query(`DELETE FROM Products WHERE ProductId = @Id`);
    return true;
  }
};
