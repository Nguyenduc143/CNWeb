import { Request, Response } from 'express';
import { adminService } from '../services/adminService';
import { success, error } from '../utils/response';

export const adminController = {
  // Thống kê Dashboard
  getDashboardStats: async (req: Request, res: Response) => {
    try {
      const stats = await adminService.getDashboardStats();
      return success(res, { stats }, 'Thống kê Admin Dashboard');
    } catch (err) {
      return error(res, 'Lỗi lấy thống kê dashboard', 500);
    }
  },

  // Lấy toàn bộ Sản Phẩm Grid
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const products = await adminService.getAllProducts();
      return success(res, { products }, 'Lấy danh sách sản phẩm QTV');
    } catch (err) {
      return error(res, 'Lỗi admin lấy ds sản phẩm', 500);
    }
  },

  // Tạo SP Mới
  createProduct: async (req: Request, res: Response) => {
    try {
      const newProd = await adminService.createProduct(req.body);
      return success(res, { product: newProd }, 'Sản phẩm đã được tạo thành công.');
    } catch (err) {
      console.error(err);
      return error(res, 'Sự cố máy chủ khi tạo SP.', 500);
    }
  },

  // Cập nhật SP
  updateProduct: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const ok = await adminService.updateProduct(id, req.body);
      if (!ok) return error(res, 'Không tìm thấy SP', 404);
      return success(res, null, 'Cập nhật thành công.');
    } catch (err) {
      console.error(err);
      return error(res, 'Sự cố máy chủ khi cập nhật.', 500);
    }
  },

  // Xóa SP
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      await adminService.deleteProduct(id);
      return success(res, null, 'Xóa vĩnh viễn sản phẩm thành công.');
    } catch (err) {
      console.error(err);
      return error(res, 'Không thể xóa SP vì đang nằm trong khóa ngoại Hóa đơn.', 400);
    }
  }
};
