// ============================================================
// FILE: catalogController.ts - CONTROLLER CHO API STOREFRONT
// ------------------------------------------------------------
// Phụ trách các API CÔNG KHAI (không cần đăng nhập):
//   - Danh mục, thương hiệu, banner
//   - Sản phẩm (list có filter, chi tiết theo slug)
//   - Flash sale đang chạy
//   - Dải sản phẩm trang chủ
// ============================================================

import { Request, Response } from 'express';
import { catalogService } from '../services/catalogService';
import { success, error } from '../utils/response';

// ------------------------------------------------------------
// GET /api/categories - Danh sách danh mục
// ------------------------------------------------------------
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await catalogService.getCategories();
    return success(res, { categories }, 'Lấy danh mục thành công');
  } catch (err: any) {
    console.error('Lỗi Catalog Controller:', err);
    return error(res, 'Gặp sự cố khi đọc Danh mục', 500);
  }
};

// ------------------------------------------------------------
// GET /api/brands - Danh sách thương hiệu
// ------------------------------------------------------------
export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await catalogService.getBrands();
    return success(res, { brands }, 'Lấy thương hiệu thành công');
  } catch (err: any) {
    console.error('Lỗi Catalog Controller:', err);
    return error(res, 'Gặp sự cố khi đọc Thương hiệu', 500);
  }
};

// ------------------------------------------------------------
// GET /api/products - Lọc + phân trang sản phẩm
// ------------------------------------------------------------
// Hỗ trợ query params:
//   page=1, pageSize=12, keyword=iphone, categoryId=1, brandId=2,
//   minPrice=5000000, maxPrice=20000000, sortBy=price-asc
//
// Response: { products: [...], pagination: { page, pageSize, totalCount, totalPages } }
// ------------------------------------------------------------
export const getProducts = async (req: Request, res: Response) => {
  try {
    // Parse các query params từ URL (đều là string -> cần ép kiểu phù hợp)
    const { page, pageSize, keyword, categoryId, brandId, minPrice, maxPrice, sortBy } = req.query;

    const data = await catalogService.getProducts({
      page: page ? parseInt(page as string) : 1,
      pageSize: pageSize ? parseInt(pageSize as string) : 12,
      keyword: keyword as string,
      categoryId: categoryId as string,
      brandId: brandId as string,
      minPrice: minPrice as string,
      maxPrice: maxPrice as string,
      sortBy: sortBy as string
    });

    // Tính tổng số trang để FE hiển thị bộ phân trang
    return success(res, {
        products: data.products,
        pagination: {
            page: page ? parseInt(page as string) : 1,
            pageSize: pageSize ? parseInt(pageSize as string) : 12,
            totalCount: data.totalCount,
            totalPages: Math.ceil(data.totalCount / (pageSize ? parseInt(pageSize as string) : 12))
        }
    }, 'Lọc sản phẩm thành công');
  } catch (err: any) {
    console.error('Lỗi Catalog Controller:', err);
    return error(res, 'Gặp sự cố khi lọc mảng Sản phẩm', 500);
  }
};

// ------------------------------------------------------------
// GET /api/flash-sale - Lấy flash sale đang chạy
// Trả về null nếu không có sự kiện nào đang diễn ra
// ------------------------------------------------------------
export const getActiveFlashSale = async (req: Request, res: Response) => {
  try {
    const data = await catalogService.getActiveFlashSale();
    if (!data) {
      // Vẫn trả 200 OK + flashSale: null thay vì lỗi -> FE dễ xử lý hơn
      return success(res, { flashSale: null }, 'Hiện không có Flash Sale nào đang diễn ra');
    }
    return success(res, { flashSale: data.event, items: data.items }, 'Flash Sale đang diễn ra');
  } catch (err: any) {
    console.error('Lỗi Catalog Controller (FlashSale):', err);
    return error(res, 'Gặp sự cố khi lấy Flash Sale', 500);
  }
};

// ------------------------------------------------------------
// GET /api/banners - Danh sách banner cho slider trang chủ
// ------------------------------------------------------------
export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await catalogService.getBanners();
    return success(res, { banners }, 'Lấy banner thành công');
  } catch (err: any) {
    console.error('Lỗi Catalog Controller (Banner):', err);
    return error(res, 'Gặp sự cố khi lấy Banner', 500);
  }
};

// ------------------------------------------------------------
// GET /api/products/:slug - Chi tiết sản phẩm theo slug
// Slug = chuỗi URL-friendly, ví dụ: "iphone-15-pro-max-256gb"
// SEO-friendly hơn ID số, dễ nhớ hơn cho user
// ------------------------------------------------------------
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const product = await catalogService.getProductBySlug(slug);

    if (!product) {
      return error(res, 'Không tìm thấy sản phẩm này', 404);
    }

    return success(res, { product }, 'Chi tiết sản phẩm');
  } catch (err: any) {
    console.error('Lỗi Catalog Controller:', err);
    return error(res, 'Gặp sự cố khi lấy chi tiết Sản phẩm', 500);
  }
};

// ------------------------------------------------------------
// GET /api/dai-san-pham - Các "row" sản phẩm theo brand cho trang chủ
// Ví dụ: Row "iPhone nổi bật", Row "Samsung Galaxy", ...
// ------------------------------------------------------------
export const getDaiSanPhamActive = async (req: Request, res: Response) => {
  try {
    const list = await catalogService.getDaiSanPhamActive();
    return success(res, { daiSanPham: list }, 'Dải sản phẩm trang chủ');
  } catch (err: any) {
    console.error('Lỗi Catalog Controller (DaiSanPham):', err);
    return error(res, 'Gặp sự cố khi lấy dải sản phẩm', 500);
  }
};
