import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { 
  getAddresses, addAddress, deleteAddress, 
  checkoutOrder, getOrderHistory, getOrderDetails 
} from '../controllers/checkoutController';

const router = Router();

// Toàn bộ Checkout bắt buộc phải quét thẻ Đăng nhập (requireAuth)
router.use(requireAuth);

/* --- USER ADDRESSES --- */
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);

/* --- ORDER CHECKOUT & HISTORY --- */
router.post('/orders', checkoutOrder);
router.get('/orders/history', getOrderHistory);
router.get('/orders/history/:id', getOrderDetails);

export default router;
