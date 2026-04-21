import { Router } from 'express';
import { getCategories, getBrands, getProducts, getProductBySlug } from '../controllers/catalogController';
import { getNewsList, getNewsDetail } from '../controllers/newsController';

const router = Router();

// Mảng API Public (Catalog Storefront) - Không cần chặn Auth Middleware
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

// News
router.get('/news', getNewsList);
router.get('/news/:id', getNewsDetail);

export default router;
