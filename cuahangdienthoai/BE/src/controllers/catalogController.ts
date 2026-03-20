import { Request, Response } from 'express';
import { catalogService } from '../services/catalogService';
import { success, error } from '../utils/response';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await catalogService.getCategories();
    return success(res, { categories }, 'Lấy danh mục thành công');
  } catch (err: any) {
    console.error('Lỗi Catalog Controller:', err);
    return error(res, 'Gặp sự cố khi đọc Danh mục', 500);
  }
};

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await catalogService.getBrands();
    return success(res, { brands }, 'Lấy thương hiệu thành công');
  } catch (err: any) {
    console.error('Lỗi Catalog Controller:', err);
    return error(res, 'Gặp sự cố khi đọc Thương hiệu', 500);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Parse query params từ FE (phân trang, search...)
    const { page, pageSize, keyword, categoryId, brandId } = req.query;

    const data = await catalogService.getProducts({
      page: page ? parseInt(page as string) : 1,
      pageSize: pageSize ? parseInt(pageSize as string) : 12,
      keyword: keyword as string,
      categoryId: categoryId as string,
      brandId: brandId as string
    });

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
