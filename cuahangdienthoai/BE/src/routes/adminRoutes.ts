

import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Áp dụng "Barrier Check vách ngăn sắt" cho NGUYÊN cụm /api/admin/*
router.use(requireAuth);
router.use(requireAdmin);


// THỐNG KÊ DASHBOARD

router.get('/dashboard/stats', adminController.getDashboardStats);


// QUẢN LÝ DANH MỤC (CRUD)
// CRUD = Create / Read / Update / Delete
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);


// QUẢN LÝ THƯƠNG HIỆU (CRUD)

router.get('/brands', adminController.getBrands);
router.post('/brands', adminController.createBrand);
router.put('/brands/:id', adminController.updateBrand);
router.delete('/brands/:id', adminController.deleteBrand);


// QUẢN LÝ ĐƠN HÀNG
// (Admin chỉ xem và đổi trạng thái, không tạo/xoá đơn)

router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);


// QUẢN LÝ THÀNH VIÊN (USERS)

router.get('/users', adminController.getAllUsers);
router.put('/users/:id/lock', adminController.toggleUserLock);   // Khoá/mở khoá
router.put('/users/:id/role', adminController.changeUserRole);   // Đổi vai trò


// QUẢN LÝ SẢN PHẨM (KHO HÀNG) - CRUD đầy đủ

router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);


// QUẢN LÝ FLASH SALE
// (Có 2 cấp: sự kiện FlashSale + các sản phẩm tham gia)

router.get('/flash-sales', adminController.getFlashSales);
router.get('/flash-sales/:id', adminController.getFlashSaleDetail);
router.post('/flash-sales', adminController.createFlashSale);
router.put('/flash-sales/:id', adminController.updateFlashSale);
router.delete('/flash-sales/:id', adminController.deleteFlashSale);
router.post('/flash-sales/items', adminController.addFlashSaleItem);          // Thêm SP vào FS
router.delete('/flash-sales/items/:itemId', adminController.removeFlashSaleItem); // Bỏ SP khỏi FS


// QUẢN LÝ TIN TỨC (Bài viết blog)

router.get('/news', adminController.getAllNews);
router.post('/news', adminController.createNews);
router.put('/news/:id', adminController.updateNews);
router.delete('/news/:id', adminController.deleteNews);


// QUẢN LÝ BANNER (Slider trang chủ)

router.get('/banners', adminController.getAllBanners);
router.post('/banners', adminController.createBanner);
router.put('/banners/:id', adminController.updateBanner);
router.delete('/banners/:id', adminController.deleteBanner);

// QUẢN LÝ DẢI SẢN PHẨM TRANG CHỦ
// (Mỗi "dải" = 1 row hiển thị nhóm SP theo thương hiệu)

router.get('/dai-san-pham', adminController.getDaiSanPham);
router.post('/dai-san-pham', adminController.createDaiSanPham);
router.put('/dai-san-pham/:id', adminController.updateDaiSanPham);
router.delete('/dai-san-pham/:id', adminController.deleteDaiSanPham);

export default router;
