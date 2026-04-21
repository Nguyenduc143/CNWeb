import sql from 'mssql';
import { getConnection } from '../config/db';

export const checkoutService = {
  // Address Management
  getAddresses: async (userId: string) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .execute('sp_GetAddressesByUser');
    return result.recordset;
  },

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
    return result.recordset[0];
  },

  deleteAddress: async (userId: string, addressId: string) => {
    const pool = await getConnection();
    await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('AddressId', sql.UniqueIdentifier, addressId)
        .execute('sp_DeleteAddress');
    return true;
  },

  // Order Management
  createOrder: async (userId: string, createData: any) => {
    // createData: { addressId, subtotal, discountAmount, total, paymentMethod, note, items: [{ProductId, Quantity, Price}] }
    const pool = await getConnection();
    const result = await pool.request()
       .input('CustomerId', sql.UniqueIdentifier, userId)
       .input('AddressId', sql.UniqueIdentifier, createData.addressId)
       .input('Subtotal', sql.Decimal(18,2), createData.subtotal)
       .input('DiscountAmount', sql.Decimal(18,2), createData.discountAmount || 0)
       .input('Total', sql.Decimal(18,2), createData.total)
       .input('PaymentMethod', sql.NVarChar, createData.paymentMethod)
       .input('Note', sql.NVarChar, createData.note || null)
       .input('OrderItemsJson', sql.NVarChar, JSON.stringify(createData.items))
       .execute('sp_CreateOrder');
    return result.recordset[0];
  },

  getOrdersHist: async (userId: string) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('CustomerId', sql.UniqueIdentifier, userId)
        .execute('sp_GetOrdersByUser');
    return result.recordset;
  },
  
  getOrderDetails: async (userId: string, orderId: string) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('CustomerId', sql.UniqueIdentifier, userId)
        .input('OrderId', sql.UniqueIdentifier, orderId)
        .execute('sp_GetOrderDetails');
        
    // SP returns 2 recordsets (Multiple Result Sets)
    const recordsets = result.recordsets as any[][];
    if (!recordsets || recordsets.length === 0 || recordsets[0].length === 0) return null;
    
    const orderInfo = recordsets[0][0];
    const items = recordsets[1] || [];
    return { ...orderInfo, Items: items };
  },

  cancelOrder: async (userId: string, orderId: string) => {
    const pool = await getConnection();
    const result = await pool.request()
      .input('OrderId', sql.UniqueIdentifier, orderId)
      .input('UserId', sql.UniqueIdentifier, userId)
      .execute('sp_CancelOrder');
    return result.recordset[0];
  }
};
