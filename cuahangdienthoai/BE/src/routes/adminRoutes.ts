import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Áp dụng Barrier Check vách ngăn sắt cho nguyên cụm nhánh API /api/admin/*
router.use(requireAuth);
router.use(requireAdmin);

// Nhánh Thống kê
router.get('/dashboard/stats', adminController.getDashboardStats);

// Nhánh Quản lý Danh Mục
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Nhánh Quản lý Thương Hiệu
router.get('/brands', adminController.getBrands);
router.post('/brands', adminController.createBrand);
router.put('/brands/:id', adminController.updateBrand);
router.delete('/brands/:id', adminController.deleteBrand);

// Nhánh Quản lý Đơn Hàng
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Nhánh Quản lý Thành Viên
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/lock', adminController.toggleUserLock);
router.put('/users/:id/role', adminController.changeUserRole);

// Nhánh Quản lý Sản Phẩm (Kho hàng)
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Nhánh Quản lý Flash Sale
router.get('/flash-sales', adminController.getFlashSales);
router.get('/flash-sales/:id', adminController.getFlashSaleDetail);
router.post('/flash-sales', adminController.createFlashSale);
router.put('/flash-sales/:id', adminController.updateFlashSale);
router.delete('/flash-sales/:id', adminController.deleteFlashSale);
router.post('/flash-sales/items', adminController.addFlashSaleItem);
router.delete('/flash-sales/items/:itemId', adminController.removeFlashSaleItem);

// Nhánh Quản lý Tin Tức
router.get('/news', adminController.getAllNews);
router.post('/news', adminController.createNews);
router.put('/news/:id', adminController.updateNews);
router.delete('/news/:id', adminController.deleteNews);

// Nhánh Quản lý Banner
router.get('/banners', adminController.getAllBanners);
router.post('/banners', adminController.createBanner);
router.put('/banners/:id', adminController.updateBanner);
router.delete('/banners/:id', adminController.deleteBanner);

// Nhánh Quản lý Dải Sản Phẩm Trang Chủ
router.get('/dai-san-pham', adminController.getDaiSanPham);
router.post('/dai-san-pham', adminController.createDaiSanPham);
router.put('/dai-san-pham/:id', adminController.updateDaiSanPham);
router.delete('/dai-san-pham/:id', adminController.deleteDaiSanPham);

export default router;
