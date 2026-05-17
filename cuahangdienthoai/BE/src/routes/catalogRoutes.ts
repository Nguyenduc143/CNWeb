import { Router } from 'express';
import { getCategories, getBrands, getProducts, getProductBySlug, getActiveFlashSale, getBanners, getDaiSanPhamActive } from '../controllers/catalogController';
import { getNewsList, getNewsDetail } from '../controllers/newsController';

const router = Router();

// Mảng API Public (Catalog Storefront) - Không cần chặn Auth Middleware
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/banners', getBanners);
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

// Flash Sale
router.get('/flash-sale', getActiveFlashSale);

// Dải Sản Phẩm Trang Chủ
router.get('/dai-san-pham', getDaiSanPhamActive);

// News
router.get('/news', getNewsList);
router.get('/news/:id', getNewsDetail);

export default router;
