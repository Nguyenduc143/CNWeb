import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Áp dụng Barrier Check vách ngăn sắt cho nguyên cụm nhánh API /api/admin/*
router.use(requireAuth);
router.use(requireAdmin);

// Nhánh Thống kê
router.get('/dashboard/stats', adminController.getDashboardStats);

// Nhánh Quản lý Sản Phẩm (Kho hàng)
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

export default router;
