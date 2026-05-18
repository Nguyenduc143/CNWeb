
// FILE: checkoutService.ts - SERVICE ĐẶT HÀNG & ĐỊA CHỈ

// Phụ trách:
//   1. Sổ địa chỉ giao hàng của user (CRUD)
//   2. Tạo đơn hàng (CHECKOUT)  - quan trọng nhất, có TRANSACTION
//   3. Lịch sử + chi tiết đơn
//   4. Huỷ đơn
//
// Toàn bộ thao tác đi qua Stored Procedure để:
//   - Đẩy logic phức tạp xuống DB (atomic, hiệu năng cao hơn)
//   - Bảo mật: code không cần ghép câu SQL bằng tay


import sql from 'mssql';
import { getConnection } from '../config/db';

export const checkoutService = {
  
  // 1) QUẢN LÝ ĐỊA CHỈ GIAO HÀNG (Address Book)
 

  // Lấy danh sách địa chỉ của user, sắp xếp theo CreatedAt DESC
  getAddresses: async (userId: string) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .execute('sp_GetAddressesByUser');
    return result.recordset;
  },

  // Thêm địa chỉ mới vào sổ
  // data: { fullName, phone, addressLine, ward, district, province, note }
  addAddress: async (userId: string, data: any) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('FullName', sql.NVarChar, data.fullName)
        .input('PhoneNumber', sql.NVarChar, data.phone)
        .input('AddressLine', sql.NVarChar, data.addressLine)
        .input('Ward', sql.NVarChar, data.ward)
        .input('District', sql.NVarChar, data.district)
        .input('Province', sql.NVarChar, data.province)
        .input('Note', sql.NVarChar, data.note || null)
        .execute('sp_AddUserAddress');
    return result.recordset[0];  // Trả về địa chỉ vừa tạo (kèm AddressId)
  },

  // Xoá địa chỉ
  // SP có check userId để ngăn user xoá địa chỉ của người khác (kể cả khi biết AddressId)
  deleteAddress: async (userId: string, addressId: string) => {
    const pool = await getConnection();
    await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('AddressId', sql.UniqueIdentifier, addressId)
        .execute('sp_DeleteAddress');
    return true;
  },

  
  // 2) TẠO ĐƠN HÀNG - QUY TRÌNH QUAN TRỌNG NHẤT
 
  createOrder: async (userId: string, createData: any) => {
    const pool = await getConnection();
    const result = await pool.request()
       .input('CustomerId', sql.UniqueIdentifier, userId)
       .input('AddressId', sql.UniqueIdentifier, createData.addressId)
       .input('Subtotal', sql.Decimal(18,2), createData.subtotal)
       .input('DiscountAmount', sql.Decimal(18,2), createData.discountAmount || 0)
       .input('Total', sql.Decimal(18,2), createData.total)
       .input('PaymentMethod', sql.NVarChar, createData.paymentMethod)
       .input('Note', sql.NVarChar, createData.note || null)
       // Truyền mảng items dưới dạng JSON string -> SP dùng OPENJSON parse
       .input('OrderItemsJson', sql.NVarChar, JSON.stringify(createData.items))
       .execute('sp_CreateOrder');
    return result.recordset[0];  // Trả về { OrderId } để FE redirect
  },

  
  // 3) LỊCH SỬ ĐƠN HÀNG
 
  getOrdersHist: async (userId: string) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('CustomerId', sql.UniqueIdentifier, userId)
        .execute('sp_GetOrdersByUser');
    return result.recordset;
  },

  
  // CHI TIẾT 1 ĐƠN HÀNG
  
  // SP trả 2 recordset:
  //   [0]: thông tin đơn (header) + địa chỉ giao
  //   [1]: chi tiết các sản phẩm trong đơn
  
  getOrderDetails: async (userId: string, orderId: string) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('CustomerId', sql.UniqueIdentifier, userId)
        .input('OrderId', sql.UniqueIdentifier, orderId)
        .execute('sp_GetOrderDetails');

    const recordsets = result.recordsets as any[][];
    if (!recordsets || recordsets.length === 0 || recordsets[0].length === 0) return null;

    const orderInfo = recordsets[0][0];
    const items = recordsets[1] || [];
    // Ghép thành 1 object cho FE dễ render
    return { ...orderInfo, Items: items };
  },

  
  // 4) HUỶ ĐƠN HÀNG
  
  cancelOrder: async (userId: string, orderId: string) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('OrderId', sql.UniqueIdentifier, orderId)
      .input('UserId', sql.UniqueIdentifier, userId)
      .execute('sp_CancelOrder');
    return result.recordset[0];
  }
};
