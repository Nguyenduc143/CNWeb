// ============================================================
// TypeScript interfaces matching CHDT.sql database schema
// ============================================================

// --- Categories ---
export interface Category {
  CategoryId: number;
  Name: string;
  Slug: string;
}

// --- Brands ---
export interface Brand {
  BrandId: number;
  Name: string;
  Slug: string;
}

// --- ProductImage ---
export interface ProductImage {
  ImageId: string;
  ProductId: string;
  ImageUrl: string;
  SortOrder: number;
}

// --- Product ---
export interface Product {
  ProductId: string;
  CategoryId: number;
  BrandId: number;
  Name: string;
  Slug: string;
  Model?: string;
  Description?: string;
  PriceSell: number;
  PriceImport?: number;
  Stock: number;
  RamGB?: number;
  RomGB?: number;
  Color?: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt?: string;
  // Joined fields (populated by API/query)
  Images?: ProductImage[];
  CategoryName?: string;
  BrandName?: string;
}

// --- User ---
export interface User {
  UserId: string;
  Email: string;
  PhoneNumber?: string;
  FullName?: string;
  IsLocked: boolean;
  CreatedAt: string;
  UpdatedAt?: string;
  Roles?: string[]; // ['Admin'] | ['Staff'] | ['Customer']
}

// --- Address ---
export interface Address {
  AddressId: string;
  CustomerId: string;
  ReceiverName: string;
  ReceiverPhone: string;
  Line1: string;
  Ward?: string;
  District?: string;
  Province?: string;
  Note?: string;
  CreatedAt: string;
}

// --- CustomerProfile ---
export interface CustomerProfile {
  CustomerId: string;
  UserId: string;
  DefaultAddressId?: string;
}

// --- Order ---
// Status: 0=Pending, 1=Confirmed, 2=Shipped, 3=Completed, 4=Cancelled
export type OrderStatus = 0 | 1 | 2 | 3 | 4;

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  0: 'Chờ xác nhận',
  1: 'Đã xác nhận',
  2: 'Đang giao hàng',
  3: 'Hoàn thành',
  4: 'Đã huỷ',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  0: '#f5a623',
  1: '#1565c0',
  2: '#7b1fa2',
  3: '#2e7d32',
  4: '#c62828',
};

export interface OrderItem {
  OrderItemId: string;
  OrderId: string;
  ProductId: string;
  Qty: number;
  UnitPrice: number;
  LineTotal: number; // Qty * UnitPrice (PERSISTED computed column)
  Product?: Product;
}

export interface Order {
  OrderId: string;
  CustomerId: string;
  AddressId?: string;
  Status: OrderStatus;
  Subtotal: number;
  DiscountAmount: number;
  Total: number;
  PaymentMethod?: string; // 'COD' | 'Card' | 'Banking'
  Note?: string;
  CreatedAt: string;
  UpdatedAt?: string;
  Items?: OrderItem[];
  Address?: Address;
}

// --- Invoice (bán tại quầy - Staff/Admin) ---
// DiscountType: 0=None, 1=Percent, 2=Amount
export type DiscountType = 0 | 1 | 2;

export const DISCOUNT_TYPE_LABEL: Record<DiscountType, string> = {
  0: 'Không giảm',
  1: 'Giảm %',
  2: 'Giảm tiền',
};

export interface InvoiceItem {
  InvoiceItemId: string;
  InvoiceId: string;
  ProductId: string;
  Qty: number;
  UnitPrice: number;
  LineTotal: number; // Qty * UnitPrice (PERSISTED)
  Product?: Product;
}

export interface Invoice {
  InvoiceId: string;
  CreatedByUserId: string;
  CustomerName?: string;
  CustomerPhone?: string;
  DiscountType: DiscountType;
  DiscountValue: number;
  Subtotal: number;
  DiscountAmount: number;
  Total: number;
  Note?: string;
  CreatedAt: string;
  Items?: InvoiceItem[];
}

// --- InventoryTransaction ---
// QtyChange > 0 = nhập kho, < 0 = xuất kho
// Reason: 'ORDER_CONFIRM' | 'INVOICE' | 'ADJUST'
export type InventoryReason = 'ORDER_CONFIRM' | 'INVOICE' | 'ADJUST';

export interface InventoryTransaction {
  TxId: string;
  ProductId: string;
  QtyChange: number;
  Reason: InventoryReason;
  RefId?: string; // OrderId hoặc InvoiceId
  CreatedByUserId?: string;
  CreatedAt: string;
}
