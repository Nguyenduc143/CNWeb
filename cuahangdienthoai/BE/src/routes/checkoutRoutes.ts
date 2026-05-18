

import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import {
  getAddresses, addAddress, deleteAddress,
  checkoutOrder, getOrderHistory, getOrderDetails, cancelOrder
} from '../controllers/checkoutController';

const router = Router();

// "BARRIER": Mọi request đến /api/user/* phải có token hợp lệ
router.use(requireAuth);

/* --- QUẢN LÝ ĐỊA CHỈ GIAO HÀNG --- */
router.get('/addresses', getAddresses);              // Lấy danh sách địa chỉ
router.post('/addresses', addAddress);               // Thêm địa chỉ mới
router.delete('/addresses/:id', deleteAddress);      // Xoá địa chỉ theo ID

/* --- ĐẶT HÀNG & LỊCH SỬ ĐƠN HÀNG --- */
router.post('/orders', checkoutOrder);                       // Đặt hàng (tạo đơn)
router.get('/orders/history', getOrderHistory);              // Lịch sử các đơn của user
router.get('/orders/history/:id', getOrderDetails);          // Chi tiết 1 đơn
router.put('/orders/:id/cancel', cancelOrder);               // Huỷ đơn (chỉ khi chưa giao)

export default router;
