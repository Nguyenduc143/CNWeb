

import { Router } from 'express';
import {
  getCategories, getBrands, getProducts, getProductBySlug,
  getActiveFlashSale, getBanners, getDaiSanPhamActive
} from '../controllers/catalogController';
import { getNewsList, getNewsDetail } from '../controllers/newsController';

const router = Router();


// 1) DANH MỤC, THƯƠNG HIỆU, BANNER (cố định)

router.get('/categories', getCategories);  // GET /api/categories
router.get('/brands', getBrands);          // GET /api/brands
router.get('/banners', getBanners);        // GET /api/banners (banner đang bật)


// 2) SẢN PHẨM

// Hỗ trợ query params: ?page=1&pageSize=12&keyword=&categoryId=&brandId=
//                      &minPrice=&maxPrice=&sortBy=
router.get('/products', getProducts);

// Chi tiết 1 sản phẩm theo slug (ví dụ: /api/products/iphone-15-pro-max)
router.get('/products/:slug', getProductBySlug);


// 3) FLASH SALE & DẢI SẢN PHẨM TRANG CHỦ

router.get('/flash-sale', getActiveFlashSale);   // Flash sale đang diễn ra
router.get('/dai-san-pham', getDaiSanPhamActive); // Các "row" sản phẩm theo brand


// 4) TIN TỨC

router.get('/news', getNewsList);        // Danh sách bài viết
router.get('/news/:id', getNewsDetail);  // Chi tiết theo ID

export default router;
