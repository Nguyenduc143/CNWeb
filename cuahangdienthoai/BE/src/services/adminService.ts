import sql from 'mssql';
import { getConnection } from '../config/db';

export const adminService = {
  // --- THỐNG KÊ DASHBOARD ---
  getDashboardStats: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        ISNULL((SELECT SUM(Total) FROM Orders WHERE Status = 3), 0) as Revenue,
        (SELECT count(*) FROM Orders WHERE Status = 0) as PendingOrders,
        (SELECT count(*) FROM Products WHERE Stock > 0) as ActiveProducts,
        (SELECT count(*) FROM Users) as TotalCustomers
    `);
    
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

  // --- QUẢN LÝ TÊN DANH MỤC ---
  getCategories: async () => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Categories ORDER BY CategoryId DESC');
    return result.recordset;
  },
  createCategory: async (data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Name', sql.NVarChar, data.name)
        .input('Slug', sql.VarChar, data.name.toLowerCase().replace(/ /g, '-'))
        .query('INSERT INTO Categories (Name, Slug) OUTPUT INSERTED.* VALUES (@Name, @Slug)');
    return result.recordset[0];
  },
  updateCategory: async (id: number, data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Id', sql.Int, id)
        .input('Name', sql.NVarChar, data.name)
        .query('UPDATE Categories SET Name=@Name WHERE CategoryId=@Id');
    return result.rowsAffected[0] > 0;
  },
  deleteCategory: async (id: number) => {
    const pool = await getConnection();
    await pool.request().input('Id', sql.Int, id).query('DELETE FROM Categories WHERE CategoryId=@Id');
    return true;
  },

  // --- QUẢN LÝ ĐƠN HÀNG ---
  getAllOrders: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT O.*, U.FullName as CustomerName, U.Email as CustomerEmail,
             (SELECT TOP 1 A.ReceiverName + ' - ' + A.ReceiverPhone + ' - ' + A.Line1 + ', ' + A.Ward + ', ' + A.District + ', ' + A.Province 
              FROM Addresses A WHERE A.AddressId = O.AddressId) AS Address
      FROM Orders O
      LEFT JOIN Users U ON O.CustomerId = U.UserId
      ORDER BY O.CreatedAt DESC
    `);
    return result.recordset;
  },
  updateOrderStatus: async (orderId: string, status: number) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('OrderId', sql.UniqueIdentifier, orderId)
      .input('Status', sql.Int, status)
      .query('UPDATE Orders SET Status = @Status, UpdatedAt = GETDATE() WHERE OrderId = @OrderId');
    return result.rowsAffected[0] > 0;
  },

  // --- QUẢN LÝ THÀNH VIÊN ---
  getAllUsers: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT UserId, Email, PhoneNumber, FullName, IsLocked, CreatedAt, Role
      FROM Users
      ORDER BY CreatedAt DESC
    `);
    return result.recordset;
  },
  toggleUserLock: async (userId: string, isLocked: boolean) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('IsLocked', sql.Bit, isLocked ? 1 : 0)
      .query('UPDATE Users SET IsLocked = @IsLocked, UpdatedAt = GETDATE() WHERE UserId = @UserId');
    return result.rowsAffected[0] > 0;
  },
  changeUserRole: async (userId: string, role: string) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('Role', sql.NVarChar, role)
      .query('UPDATE Users SET Role = @Role, UpdatedAt = GETDATE() WHERE UserId = @UserId');
    return result.rowsAffected[0] > 0;
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
