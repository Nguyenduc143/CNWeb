import { Router } from 'express';
import { getCategories, getBrands, getProducts, getProductBySlug } from '../controllers/catalogController';

const router = Router();

// Mảng API Public (Catalog Storefront) - Không cần chặn Auth Middleware
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

export default router;
