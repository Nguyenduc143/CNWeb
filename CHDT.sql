-- 1) Users
CREATE TABLE Users (
    UserId           uniqueidentifier NOT NULL CONSTRAINT PK_Users PRIMARY KEY DEFAULT NEWID(),
    Email            nvarchar(256)     NOT NULL,
    PhoneNumber      nvarchar(30)      NULL,
    FullName         nvarchar(200)     NULL,

    PasswordHash     nvarchar(500)     NOT NULL, -- lưu hash (BCrypt/ASP.NET hasher)
    IsLocked         bit               NOT NULL CONSTRAINT DF_Users_IsLocked DEFAULT(0),

    CreatedAt        datetime2         NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt        datetime2         NULL
);
CREATE UNIQUE INDEX UX_Users_Email ON Users(Email);

-- 2) Roles
CREATE TABLE Roles (
    RoleId           int              NOT NULL IDENTITY(1,1) CONSTRAINT PK_Roles PRIMARY KEY,
    RoleName         nvarchar(50)     NOT NULL
);

CREATE UNIQUE INDEX UX_Roles_RoleName ON Roles(RoleName);

-- 3) UserRoles (many-to-many)
CREATE TABLE UserRoles (
    UserId           uniqueidentifier NOT NULL,
    RoleId           int              NOT NULL,
    CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES dbo.Roles(RoleId)
);

-- Seed roles
INSERT INTO dbo.Roles(RoleName) VALUES (N'Admin'), (N'Staff'), (N'Customer');



-- Categories (vd: iPhone, Samsung, Xiaomi, Phụ kiện...)
CREATE TABLE Categories (
    CategoryId       int              NOT NULL IDENTITY(1,1) CONSTRAINT PK_Categories PRIMARY KEY,
    Name             nvarchar(100)    NOT NULL,
    Slug             nvarchar(120)    NOT NULL
);
CREATE UNIQUE INDEX UX_Categories_Slug ON Categories(Slug);

-- Brands
CREATE TABLE Brands (
    BrandId          int              NOT NULL IDENTITY(1,1) CONSTRAINT PK_Brands PRIMARY KEY,
    Name             nvarchar(100)    NOT NULL,
    Slug             nvarchar(120)    NOT NULL
);
CREATE UNIQUE INDEX UX_Brands_Slug ON Brands(Slug);

-- Products (điện thoại)
CREATE TABLE Products (
    ProductId        uniqueidentifier NOT NULL CONSTRAINT PK_Products PRIMARY KEY DEFAULT NEWID(),
    CategoryId       int              NOT NULL,
    BrandId          int              NOT NULL,

    Name             nvarchar(200)    NOT NULL,   -- iPhone 15 Pro Max
    Slug             nvarchar(220)    NOT NULL,   -- url-friendly
    Model            nvarchar(100)    NULL,       -- Axxxx / SKU
    Description      nvarchar(max)    NULL,

    PriceSell        decimal(18,2)    NOT NULL,
    PriceImport      decimal(18,2)    NULL,
    Stock            int              NOT NULL CONSTRAINT DF_Products_Stock DEFAULT(0),

    RamGB            int              NULL,
    RomGB            int              NULL,
    Color            nvarchar(50)     NULL,

    IsActive         bit              NOT NULL CONSTRAINT DF_Products_IsActive DEFAULT(1),

    CreatedAt        datetime2        NOT NULL CONSTRAINT DF_Products_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt        datetime2        NULL,

    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(CategoryId),
    CONSTRAINT FK_Products_Brands     FOREIGN KEY (BrandId) REFERENCES dbo.Brands(BrandId),

    CONSTRAINT CK_Products_Prices CHECK (PriceSell >= 0 AND (PriceImport IS NULL OR PriceImport >= 0)),
    CONSTRAINT CK_Products_Stock  CHECK (Stock >= 0)
);

CREATE UNIQUE INDEX UX_Products_Slug ON Products(Slug);
CREATE INDEX IX_Products_Category ON Products(CategoryId);
CREATE INDEX IX_Products_Brand ON Products(BrandId);
CREATE INDEX IX_Products_PriceSell ON Products(PriceSell);

-- Product Images (phục vụ UI kiểu Apple - gallery)
CREATE TABLE ProductImages (
    ImageId          uniqueidentifier NOT NULL CONSTRAINT PK_ProductImages PRIMARY KEY DEFAULT NEWID(),
    ProductId        uniqueidentifier NOT NULL,
    ImageUrl         nvarchar(500)    NOT NULL,
    SortOrder        int              NOT NULL CONSTRAINT DF_ProductImages_SortOrder DEFAULT(0),
    CONSTRAINT FK_ProductImages_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(ProductId) ON DELETE CASCADE
);
CREATE INDEX IX_ProductImages_Product ON ProductImages(ProductId, SortOrder);




-- CustomerProfiles: map 1-1 với Users (role Customer)
CREATE TABLE CustomerProfiles (
    CustomerId       uniqueidentifier NOT NULL CONSTRAINT PK_CustomerProfiles PRIMARY KEY,
    UserId           uniqueidentifier NOT NULL,
    DefaultAddressId uniqueidentifier NULL,

    CONSTRAINT FK_CustomerProfiles_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
);
CREATE UNIQUE INDEX UX_CustomerProfiles_UserId ON CustomerProfiles(UserId);

-- Addresses
CREATE TABLE Addresses (
    AddressId        uniqueidentifier NOT NULL CONSTRAINT PK_Addresses PRIMARY KEY DEFAULT NEWID(),
    CustomerId       uniqueidentifier NOT NULL,
    ReceiverName     nvarchar(200)    NOT NULL,
    ReceiverPhone    nvarchar(30)     NOT NULL,
    Line1            nvarchar(300)    NOT NULL,
    Ward             nvarchar(120)    NULL,
    District         nvarchar(120)    NULL,
    Province         nvarchar(120)    NULL,
    Note             nvarchar(300)    NULL,
    CreatedAt        datetime2        NOT NULL CONSTRAINT DF_Addresses_CreatedAt DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_Addresses_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.CustomerProfiles(CustomerId) ON DELETE CASCADE
);
CREATE INDEX IX_Addresses_Customer ON Addresses(CustomerId);

ALTER TABLE CustomerProfiles
ADD CONSTRAINT FK_CustomerProfiles_DefaultAddress
FOREIGN KEY (DefaultAddressId) REFERENCES Addresses(AddressId);




-- Order status: 0 Pending, 1 Confirmed, 2 Shipped, 3 Completed, 4 Cancelled
CREATE TABLE Orders (
    OrderId          uniqueidentifier NOT NULL CONSTRAINT PK_Orders PRIMARY KEY DEFAULT NEWID(),
    CustomerId       uniqueidentifier NOT NULL,
    AddressId        uniqueidentifier NULL,

    Status           int              NOT NULL CONSTRAINT DF_Orders_Status DEFAULT(0),

    Subtotal         decimal(18,2)    NOT NULL CONSTRAINT DF_Orders_Subtotal DEFAULT(0),
    DiscountAmount   decimal(18,2)    NOT NULL CONSTRAINT DF_Orders_Discount DEFAULT(0),
    Total            decimal(18,2)    NOT NULL CONSTRAINT DF_Orders_Total DEFAULT(0),

    PaymentMethod    nvarchar(50)     NULL, -- COD/Card/Banking (tuỳ)
    Note             nvarchar(500)    NULL,

    CreatedAt        datetime2        NOT NULL CONSTRAINT DF_Orders_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt        datetime2        NULL,

    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerId) REFERENCES CustomerProfiles(CustomerId),
    CONSTRAINT FK_Orders_Address   FOREIGN KEY (AddressId) REFERENCES Addresses(AddressId),

    CONSTRAINT CK_Orders_Status CHECK (Status IN (0,1,2,3,4)),
    CONSTRAINT CK_Orders_Money CHECK (Subtotal >= 0 AND DiscountAmount >= 0 AND Total >= 0)
);

CREATE INDEX IX_Orders_Customer ON Orders(CustomerId, CreatedAt DESC);
CREATE INDEX IX_Orders_Status ON Orders(Status, CreatedAt DESC);

CREATE TABLE OrderItems (
    OrderItemId      uniqueidentifier NOT NULL CONSTRAINT PK_OrderItems PRIMARY KEY DEFAULT NEWID(),
    OrderId          uniqueidentifier NOT NULL,
    ProductId        uniqueidentifier NOT NULL,

    Qty              int              NOT NULL,
    UnitPrice        decimal(18,2)    NOT NULL, -- chốt tại thời điểm đặt
    LineTotal        AS (Qty * UnitPrice) PERSISTED,

    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId) REFERENCES Products(ProductId),

    CONSTRAINT CK_OrderItems_Qty CHECK (Qty > 0),
    CONSTRAINT CK_OrderItems_Price CHECK (UnitPrice >= 0)
);

CREATE INDEX IX_OrderItems_Order ON OrderItems(OrderId);
CREATE INDEX IX_OrderItems_Product ON OrderItems(ProductId);



-- Invoice: dành cho Staff/Admin tạo tại quầy
CREATE TABLE Invoices (
    InvoiceId        uniqueidentifier NOT NULL CONSTRAINT PK_Invoices PRIMARY KEY DEFAULT NEWID(),
    CreatedByUserId  uniqueidentifier NOT NULL, -- staff/admin
    CustomerName     nvarchar(200)    NULL,     -- bán lẻ có thể không cần customerId
    CustomerPhone    nvarchar(30)     NULL,

    DiscountType     int              NOT NULL CONSTRAINT DF_Invoices_DiscountType DEFAULT(0), -- 0 None, 1 Percent, 2 Amount
    DiscountValue    decimal(18,2)    NOT NULL CONSTRAINT DF_Invoices_DiscountValue DEFAULT(0),

    Subtotal         decimal(18,2)    NOT NULL CONSTRAINT DF_Invoices_Subtotal DEFAULT(0),
    DiscountAmount   decimal(18,2)    NOT NULL CONSTRAINT DF_Invoices_DiscountAmount DEFAULT(0),
    Total            decimal(18,2)    NOT NULL CONSTRAINT DF_Invoices_Total DEFAULT(0),

    Note             nvarchar(500)    NULL,
    CreatedAt        datetime2        NOT NULL CONSTRAINT DF_Invoices_CreatedAt DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_Invoices_Users FOREIGN KEY (CreatedByUserId) REFERENCES dbo.Users(UserId),
    CONSTRAINT CK_Invoices_DiscountType CHECK (DiscountType IN (0,1,2)),
    CONSTRAINT CK_Invoices_Money CHECK (Subtotal >= 0 AND DiscountAmount >= 0 AND Total >= 0)
);
CREATE INDEX IX_Invoices_CreatedAt ON Invoices(CreatedAt DESC);

CREATE TABLE InvoiceItems (
    InvoiceItemId    uniqueidentifier NOT NULL CONSTRAINT PK_InvoiceItems PRIMARY KEY DEFAULT NEWID(),
    InvoiceId        uniqueidentifier NOT NULL,
    ProductId        uniqueidentifier NOT NULL,
    Qty              int              NOT NULL,
    UnitPrice        decimal(18,2)    NOT NULL,
    LineTotal        AS (Qty * UnitPrice) PERSISTED,

    CONSTRAINT FK_InvoiceItems_Invoices FOREIGN KEY (InvoiceId) REFERENCES Invoices(InvoiceId) ON DELETE CASCADE,
    CONSTRAINT FK_InvoiceItems_Products FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    CONSTRAINT CK_InvoiceItems_Qty CHECK (Qty > 0),
    CONSTRAINT CK_InvoiceItems_Price CHECK (UnitPrice >= 0)
);
CREATE INDEX IX_InvoiceItems_Invoice ON InvoiceItems(InvoiceId);



-- InventoryTransactions: +Qty nhập, -Qty xuất
CREATE TABLE InventoryTransactions (
    TxId             uniqueidentifier NOT NULL CONSTRAINT PK_InventoryTransactions PRIMARY KEY DEFAULT NEWID(),
    ProductId        uniqueidentifier NOT NULL,
    QtyChange        int              NOT NULL, -- âm là xuất, dương là nhập
    Reason           nvarchar(100)    NOT NULL, -- 'ORDER_CONFIRM', 'INVOICE', 'ADJUST'
    RefId            uniqueidentifier NULL,     -- OrderId/InvoiceId
    CreatedByUserId  uniqueidentifier NULL,
    CreatedAt        datetime2        NOT NULL CONSTRAINT DF_InventoryTransactions_CreatedAt DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_InvTx_Products FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    CONSTRAINT FK_InvTx_Users FOREIGN KEY (CreatedByUserId) REFERENCES Users(UserId)
);
CREATE INDEX IX_InvTx_Product ON InventoryTransactions(ProductId, CreatedAt DESC);
