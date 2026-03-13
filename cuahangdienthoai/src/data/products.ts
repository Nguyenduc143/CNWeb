import { Category, Brand, Product, Order, Invoice } from './types';

// ============================================================
// Mock Categories (khớp bảng Categories)
// ============================================================
export const categories: Category[] = [
  { CategoryId: 1, Name: 'iPhone',       Slug: 'iphone' },
  { CategoryId: 2, Name: 'Samsung',      Slug: 'samsung' },
  { CategoryId: 3, Name: 'Oppo',         Slug: 'oppo' },
  { CategoryId: 4, Name: 'Xiaomi',       Slug: 'xiaomi' },
  { CategoryId: 5, Name: 'Phụ kiện',     Slug: 'phu-kien' },
  { CategoryId: 6, Name: 'Tablet',       Slug: 'tablet' },
  { CategoryId: 7, Name: 'Sửa chữa',    Slug: 'sua-chua' },
];

// ============================================================
// Mock Brands (khớp bảng Brands)
// ============================================================
export const brands: Brand[] = [
  { BrandId: 1, Name: 'Apple',   Slug: 'apple' },
  { BrandId: 2, Name: 'Samsung', Slug: 'samsung' },
  { BrandId: 3, Name: 'Oppo',   Slug: 'oppo' },
  { BrandId: 4, Name: 'Xiaomi',  Slug: 'xiaomi' },
  { BrandId: 5, Name: 'JBL',    Slug: 'jbl' },
  { BrandId: 6, Name: 'Harman Kardon', Slug: 'harman-kardon' },
];

// ============================================================
// Mock Products - iPhone (CategoryId=1, BrandId=1)
// Khớp bảng Products + ProductImages
// ============================================================
export const iphoneProducts: Product[] = [
  {
    ProductId: 'p-iphone-16-pro-max',
    CategoryId: 1, BrandId: 1,
    Name: 'iPhone 16 Pro Max 512GB',
    Slug: 'iphone-16-pro-max-512gb',
    Model: 'A3293',
    PriceSell: 32900000, PriceImport: 28000000,
    Stock: 15,
    RamGB: 8, RomGB: 512, Color: 'Titan Sa Mạc',
    IsActive: true, CreatedAt: '2025-01-10T00:00:00Z',
    CategoryName: 'iPhone', BrandName: 'Apple',
    Images: [{ ImageId: 'img-1', ProductId: 'p-iphone-16-pro-max', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/iPhone-16-Pro-Max-512GB-Chinh-Hang.jpg' }],
  },
  {
    ProductId: 'p-iphone-15-pro-max',
    CategoryId: 1, BrandId: 1,
    Name: 'iPhone 15 Pro Max 512GB',
    Slug: 'iphone-15-pro-max-512gb',
    Model: 'A3105',
    PriceSell: 25900000, PriceImport: 21000000,
    Stock: 20,
    RamGB: 8, RomGB: 512, Color: 'Titan Tự Nhiên',
    IsActive: true, CreatedAt: '2025-01-08T00:00:00Z',
    CategoryName: 'iPhone', BrandName: 'Apple',
    Images: [{ ImageId: 'img-2', ProductId: 'p-iphone-15-pro-max', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/iPhone-15-Pro-Max-512GB-quoc-te.jpg' }],
  },
  {
    ProductId: 'p-iphone-14-pro',
    CategoryId: 1, BrandId: 1,
    Name: 'iPhone 14 Pro 256GB',
    Slug: 'iphone-14-pro-256gb',
    Model: 'A2890',
    PriceSell: 17500000, PriceImport: 14000000,
    Stock: 12,
    RamGB: 6, RomGB: 256, Color: 'Tím Đậm',
    IsActive: true, CreatedAt: '2025-01-05T00:00:00Z',
    CategoryName: 'iPhone', BrandName: 'Apple',
    Images: [{ ImageId: 'img-3', ProductId: 'p-iphone-14-pro', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/iPhone-14-Pro-256GB.jpg' }],
  },
  {
    ProductId: 'p-iphone-13-pro',
    CategoryId: 1, BrandId: 1,
    Name: 'iPhone 13 Pro 512GB',
    Slug: 'iphone-13-pro-512gb',
    Model: 'A2638',
    PriceSell: 14900000, PriceImport: 11500000,
    Stock: 8,
    RamGB: 6, RomGB: 512, Color: 'Xanh Núi Alps',
    IsActive: true, CreatedAt: '2025-01-03T00:00:00Z',
    CategoryName: 'iPhone', BrandName: 'Apple',
    Images: [{ ImageId: 'img-4', ProductId: 'p-iphone-13-pro', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/iPhone-13-Pro-512GB.jpg' }],
  },
  {
    ProductId: 'p-iphone-12-pro-max',
    CategoryId: 1, BrandId: 1,
    Name: 'iPhone 12 Pro Max 512GB',
    Slug: 'iphone-12-pro-max-512gb',
    Model: 'A2411',
    PriceSell: 12500000, PriceImport: 9500000,
    Stock: 5,
    RamGB: 6, RomGB: 512, Color: 'Xanh Thái Bình Dương',
    IsActive: true, CreatedAt: '2024-12-20T00:00:00Z',
    CategoryName: 'iPhone', BrandName: 'Apple',
    Images: [{ ImageId: 'img-5', ProductId: 'p-iphone-12-pro-max', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/iPhone-12-Pro-Max-512GB.jpg' }],
  },
  {
    ProductId: 'p-iphone-11-pro',
    CategoryId: 1, BrandId: 1,
    Name: 'iPhone 11 Pro 64GB',
    Slug: 'iphone-11-pro-64gb',
    Model: 'A2215',
    PriceSell: 7900000, PriceImport: 5800000,
    Stock: 10,
    RamGB: 4, RomGB: 64, Color: 'Vàng',
    IsActive: true, CreatedAt: '2024-12-15T00:00:00Z',
    CategoryName: 'iPhone', BrandName: 'Apple',
    Images: [{ ImageId: 'img-6', ProductId: 'p-iphone-11-pro', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/iPhone-11-Pro-64GB.jpg' }],
  },
  {
    ProductId: 'p-iphone-xs-max',
    CategoryId: 1, BrandId: 1,
    Name: 'iPhone XS Max 512GB',
    Slug: 'iphone-xs-max-512gb',
    Model: 'A2101',
    PriceSell: 5900000, PriceImport: 4200000,
    Stock: 7,
    RamGB: 4, RomGB: 512, Color: 'Bạc',
    IsActive: true, CreatedAt: '2024-12-10T00:00:00Z',
    CategoryName: 'iPhone', BrandName: 'Apple',
    Images: [{ ImageId: 'img-7', ProductId: 'p-iphone-xs-max', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Iphone-Xs-Max-512Gb.jpg' }],
  },
  {
    ProductId: 'p-iphone-8-plus',
    CategoryId: 1, BrandId: 1,
    Name: 'iPhone 8 Plus 64GB',
    Slug: 'iphone-8-plus-64gb',
    Model: 'A1864',
    PriceSell: 3900000, PriceImport: 2600000,
    Stock: 3,
    RamGB: 3, RomGB: 64, Color: 'Đen',
    IsActive: true, CreatedAt: '2024-11-01T00:00:00Z',
    CategoryName: 'iPhone', BrandName: 'Apple',
    Images: [{ ImageId: 'img-8', ProductId: 'p-iphone-8-plus', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2019/10/iphone-8-plus-galaxydidong-1.jpg' }],
  },
];

// ============================================================
// Mock Products - Samsung (CategoryId=2, BrandId=2)
// ============================================================
export const samsungProducts: Product[] = [
  {
    ProductId: 'p-s24-ultra',
    CategoryId: 2, BrandId: 2,
    Name: 'Samsung Galaxy S24 Ultra 512GB',
    Slug: 'samsung-galaxy-s24-ultra-512gb',
    Model: 'SM-S928B',
    PriceSell: 28900000, PriceImport: 24000000,
    Stock: 18,
    RamGB: 12, RomGB: 512, Color: 'Titanium Black',
    IsActive: true, CreatedAt: '2025-01-12T00:00:00Z',
    CategoryName: 'Samsung', BrandName: 'Samsung',
    Images: [{ ImageId: 'img-101', ProductId: 'p-s24-ultra', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Samsung-Galaxy-S24-Ultra-5G-512GB.jpg' }],
  },
  {
    ProductId: 'p-s23-ultra',
    CategoryId: 2, BrandId: 2,
    Name: 'Samsung Galaxy S23 Ultra 512GB',
    Slug: 'samsung-galaxy-s23-ultra-512gb',
    Model: 'SM-S918B',
    PriceSell: 18900000, PriceImport: 15000000,
    Stock: 14,
    RamGB: 12, RomGB: 512, Color: 'Phantom Black',
    IsActive: true, CreatedAt: '2025-01-10T00:00:00Z',
    CategoryName: 'Samsung', BrandName: 'Samsung',
    Images: [{ ImageId: 'img-102', ProductId: 'p-s23-ultra', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Samsung-Galaxy-S23-Ultra-5G-512GB-RAM-12GB.jpg' }],
  },
  {
    ProductId: 'p-s22-ultra',
    CategoryId: 2, BrandId: 2,
    Name: 'Samsung Galaxy S22 Ultra 512GB',
    Slug: 'samsung-galaxy-s22-ultra-512gb',
    Model: 'SM-S908B',
    PriceSell: 14500000, PriceImport: 11000000,
    Stock: 9,
    RamGB: 12, RomGB: 512, Color: 'Burgundy',
    IsActive: true, CreatedAt: '2025-01-05T00:00:00Z',
    CategoryName: 'Samsung', BrandName: 'Samsung',
    Images: [{ ImageId: 'img-103', ProductId: 'p-s22-ultra', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Samsung-Galaxy-S22-Ultra-5G-–-512GB-–-RAM-12GB.jpg' }],
  },
  {
    ProductId: 'p-z-fold6',
    CategoryId: 2, BrandId: 2,
    Name: 'Samsung Galaxy Z Fold6 512GB',
    Slug: 'samsung-galaxy-z-fold6-512gb',
    Model: 'SM-F956B',
    PriceSell: 35000000, PriceImport: 29000000,
    Stock: 6,
    RamGB: 12, RomGB: 512, Color: 'Navy',
    IsActive: true, CreatedAt: '2025-01-15T00:00:00Z',
    CategoryName: 'Samsung', BrandName: 'Samsung',
    Images: [{ ImageId: 'img-104', ProductId: 'p-z-fold6', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Galaxy-Z-Fold6-5G-12G-ban-512GB-1.jpg' }],
  },
  {
    ProductId: 'p-z-flip6',
    CategoryId: 2, BrandId: 2,
    Name: 'Samsung Galaxy Z Flip6 512GB',
    Slug: 'samsung-galaxy-z-flip6-512gb',
    Model: 'SM-F741B',
    PriceSell: 18500000, PriceImport: 15000000,
    Stock: 11,
    RamGB: 12, RomGB: 512, Color: 'Mint',
    IsActive: true, CreatedAt: '2025-01-15T00:00:00Z',
    CategoryName: 'Samsung', BrandName: 'Samsung',
    Images: [{ ImageId: 'img-105', ProductId: 'p-z-flip6', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Galaxy-Z-Flip6-5G-12G-ban-512-1.jpg' }],
  },
  {
    ProductId: 'p-s21-ultra',
    CategoryId: 2, BrandId: 2,
    Name: 'Samsung Galaxy S21 Ultra 512GB',
    Slug: 'samsung-galaxy-s21-ultra-512gb',
    Model: 'SM-G998B',
    PriceSell: 11900000, PriceImport: 9000000,
    Stock: 4,
    RamGB: 16, RomGB: 512, Color: 'Phantom Silver',
    IsActive: true, CreatedAt: '2024-12-20T00:00:00Z',
    CategoryName: 'Samsung', BrandName: 'Samsung',
    Images: [{ ImageId: 'img-106', ProductId: 'p-s21-ultra', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Samsung-Galaxy-S21-Ultra-5G-–-512GB-–-RAM-16GB.jpg' }],
  },
  {
    ProductId: 'p-note20-ultra',
    CategoryId: 2, BrandId: 2,
    Name: 'Samsung Galaxy Note 20 Ultra 512GB',
    Slug: 'samsung-galaxy-note20-ultra-512gb',
    Model: 'SM-N986B',
    PriceSell: 9900000, PriceImport: 7500000,
    Stock: 5,
    RamGB: 12, RomGB: 512, Color: 'Mystic Bronze',
    IsActive: true, CreatedAt: '2024-12-10T00:00:00Z',
    CategoryName: 'Samsung', BrandName: 'Samsung',
    Images: [{ ImageId: 'img-107', ProductId: 'p-note20-ultra', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2025/01/Galaxy-Note-20-Ultra-5G-–-512GB-–-RAM-12GB.jpg' }],
  },
  {
    ProductId: 'p-note9',
    CategoryId: 2, BrandId: 2,
    Name: 'Samsung Galaxy Note 9 512GB',
    Slug: 'samsung-galaxy-note9-512gb',
    Model: 'SM-N960F',
    PriceSell: 5500000, PriceImport: 3800000,
    Stock: 3,
    RamGB: 8, RomGB: 512, Color: 'Ocean Blue',
    IsActive: true, CreatedAt: '2024-11-01T00:00:00Z',
    CategoryName: 'Samsung', BrandName: 'Samsung',
    Images: [{ ImageId: 'img-108', ProductId: 'p-note9', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2022/11/galaxydidong-Note-9.jpg' }],
  },
];

// ============================================================
// Flash Sale products (subset, giá PriceSell đã giảm)
// ============================================================
export const flashSaleProducts: Product[] = [
  { ...iphoneProducts[0],  ProductId: 'fs-1', PriceSell: 29900000 },
  { ...samsungProducts[0], ProductId: 'fs-2', PriceSell: 25900000 },
  { ...iphoneProducts[2],  ProductId: 'fs-3', PriceSell: 15900000 },
  { ...samsungProducts[2], ProductId: 'fs-4', PriceSell: 12500000 },
];

// ============================================================
// Mock sản phẩm sửa chữa (CategoryId=7)
// Mô hình như Products nhưng không có RamGB/RomGB
// ============================================================
export const repairProducts: Product[] = [
  {
    ProductId: 'rep-1',
    CategoryId: 7, BrandId: 1,
    Name: 'Thay màn hình iPhone 14',
    Slug: 'thay-man-hinh-iphone-14',
    PriceSell: 3000000, PriceImport: 1800000,
    Stock: 999, IsActive: true, CreatedAt: '2025-01-01T00:00:00Z',
    CategoryName: 'Sửa chữa', BrandName: 'Apple',
    Images: [{ ImageId: 'img-r1', ProductId: 'rep-1', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2023/04/anh-dai-dien-thay-man-iphone-14-14-plus.jpg' }],
  },
  {
    ProductId: 'rep-2',
    CategoryId: 7, BrandId: 1,
    Name: 'Thay mặt kính iPhone 13',
    Slug: 'thay-mat-kinh-iphone-13',
    PriceSell: 1200000, PriceImport: 600000,
    Stock: 999, IsActive: true, CreatedAt: '2025-01-01T00:00:00Z',
    CategoryName: 'Sửa chữa', BrandName: 'Apple',
    Images: [{ ImageId: 'img-r2', ProductId: 'rep-2', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2023/04/thay-mat-kinh-iphone-13-galaxydidong-Gcare.jpg' }],
  },
  {
    ProductId: 'rep-3',
    CategoryId: 7, BrandId: 1,
    Name: 'Thay màn hình iPhone 14 Plus',
    Slug: 'thay-man-hinh-iphone-14-plus',
    PriceSell: 3500000, PriceImport: 2100000,
    Stock: 999, IsActive: true, CreatedAt: '2025-01-01T00:00:00Z',
    CategoryName: 'Sửa chữa', BrandName: 'Apple',
    Images: [{ ImageId: 'img-r3', ProductId: 'rep-3', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2023/04/anh-dai-dien-thay-man-iphone-14-14-plus.jpg' }],
  },
  {
    ProductId: 'rep-4',
    CategoryId: 7, BrandId: 1,
    Name: 'Thay màn hình iPhone 14 Pro',
    Slug: 'thay-man-hinh-iphone-14-pro',
    PriceSell: 7400000, PriceImport: 4500000,
    Stock: 999, IsActive: true, CreatedAt: '2025-01-01T00:00:00Z',
    CategoryName: 'Sửa chữa', BrandName: 'Apple',
    Images: [{ ImageId: 'img-r4', ProductId: 'rep-4', SortOrder: 0,
      ImageUrl: 'https://galaxydidong.vn/wp-content/uploads/2023/04/Anh-dai-dien-thay-man-iphone-14-pro-14-pro-max.jpg' }],
  },
];

// ============================================================
// Mock Orders (khớp bảng Orders + OrderItems)
// ============================================================
export const mockOrders: Order[] = [
  {
    OrderId: 'ord-001',
    CustomerId: 'cust-001',
    AddressId: 'addr-001',
    Status: 3,
    Subtotal: 32900000,
    DiscountAmount: 0,
    Total: 32900000,
    PaymentMethod: 'COD',
    CreatedAt: '2025-03-01T10:00:00Z',
    Items: [
      {
        OrderItemId: 'oi-001', OrderId: 'ord-001',
        ProductId: 'p-iphone-16-pro-max',
        Qty: 1, UnitPrice: 32900000, LineTotal: 32900000,
        Product: iphoneProducts[0],
      },
    ],
  },
  {
    OrderId: 'ord-002',
    CustomerId: 'cust-002',
    AddressId: 'addr-002',
    Status: 1,
    Subtotal: 57800000,
    DiscountAmount: 1000000,
    Total: 56800000,
    PaymentMethod: 'Banking',
    CreatedAt: '2025-03-10T14:30:00Z',
    Items: [
      {
        OrderItemId: 'oi-002', OrderId: 'ord-002',
        ProductId: 'p-iphone-16-pro-max',
        Qty: 1, UnitPrice: 32900000, LineTotal: 32900000,
        Product: iphoneProducts[0],
      },
      {
        OrderItemId: 'oi-003', OrderId: 'ord-002',
        ProductId: 'p-s24-ultra',
        Qty: 1, UnitPrice: 28900000, LineTotal: 28900000,
        Product: samsungProducts[0],
      },
    ],
  },
];

// ============================================================
// Mock Invoices (bán tại quầy - khớp bảng Invoices + InvoiceItems)
// ============================================================
export const mockInvoices: Invoice[] = [
  {
    InvoiceId: 'inv-001',
    CreatedByUserId: 'staff-001',
    CustomerName: 'Nguyễn Văn A',
    CustomerPhone: '0901234567',
    DiscountType: 1, // Percent
    DiscountValue: 5,
    Subtotal: 32900000,
    DiscountAmount: 1645000,
    Total: 31255000,
    CreatedAt: '2025-03-12T09:00:00Z',
    Items: [
      {
        InvoiceItemId: 'ii-001', InvoiceId: 'inv-001',
        ProductId: 'p-iphone-16-pro-max',
        Qty: 1, UnitPrice: 32900000, LineTotal: 32900000,
        Product: iphoneProducts[0],
      },
    ],
  },
];

