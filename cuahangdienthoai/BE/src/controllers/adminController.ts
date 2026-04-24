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

  // --- Danh mục CRUD ---
  getCategories: async (req: Request, res: Response) => {
    try {
      const cates = await adminService.getCategories();
      return success(res, { categories: cates }, 'Lấy danh mục thành công');
    } catch (err) { return error(res, 'Lỗi', 500); }
  },
  createCategory: async (req: Request, res: Response) => {
    try {
      const newCate = await adminService.createCategory(req.body);
      return success(res, { category: newCate }, 'Tạo danh mục xong');
    } catch (err) { return error(res, 'Lỗi', 500); }
  },
  updateCategory: async (req: Request, res: Response) => {
    try {
      await adminService.updateCategory(Number(req.params.id), req.body);
      return success(res, null, 'Cập nhật xong');
    } catch (err) { return error(res, 'Lỗi', 500); }
  },
  deleteCategory: async (req: Request, res: Response) => {
    try {
      await adminService.deleteCategory(Number(req.params.id));
      return success(res, null, 'Xóa danh mục xong');
    } catch (err) { return error(res, 'Không thể xóa do bị ràng buộc', 400); }
  },

  // --- Thương Hiệu ---
  getBrands: async (req: Request, res: Response) => {
    try {
      const brands = await adminService.getBrands();
      return success(res, { brands }, 'Lấy danh sách thương hiệu');
    } catch (err) { return error(res, 'Lỗi', 500); }
  },
  createBrand: async (req: Request, res: Response) => {
    try {
      const created = await adminService.createBrand(req.body);
      return success(res, { brand: created }, 'Tạo thương hiệu thành công');
    } catch (err) { return error(res, 'Lỗi', 500); }
  },
  updateBrand: async (req: Request, res: Response) => {
    try {
      await adminService.updateBrand(Number(req.params.id), req.body);
      return success(res, null, 'Cập nhật thương hiệu thành công');
    } catch (err) { return error(res, 'Lỗi', 500); }
  },
  deleteBrand: async (req: Request, res: Response) => {
    try {
      await adminService.deleteBrand(Number(req.params.id));
      return success(res, null, 'Xóa thương hiệu thành công');
    } catch (err) { return error(res, 'Thương hiệu đang có sản phẩm. Không thể xóa', 400); }
  },

  // --- Đơn hàng ---
  getAllOrders: async (req: Request, res: Response) => {
    try {
      const orders = await adminService.getAllOrders();
      return success(res, { orders }, 'Lấy danh sách đơn hàng thành công');
    } catch (err) { return error(res, 'Lỗi', 500); }
  },
  updateOrderStatus: async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      await adminService.updateOrderStatus(req.params.id as string, status);
      return success(res, null, 'Cập nhật trạng thái đơn thành công');
    } catch (err) { return error(res, 'Lỗi cập nhật', 500); }
  },

  // --- Thành viên ---
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await adminService.getAllUsers();
      return success(res, { users }, 'Danh sách người dùng');
    } catch (err) { return error(res, 'Lỗi', 500); }
  },
  toggleUserLock: async (req: Request, res: Response) => {
    try {
      const { isLocked } = req.body;
      await adminService.toggleUserLock(req.params.id as string, isLocked);
      return success(res, null, isLocked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
    } catch (err) { return error(res, 'Lỗi thay đổi trạng thái', 500); }
  },
  changeUserRole: async (req: Request, res: Response) => {
    try {
      const { role } = req.body;
      await adminService.changeUserRole(req.params.id as string, role);
      return success(res, null, 'Đã cập nhật phân quyền thành công');
    } catch (err) { return error(res, 'Lỗi thay đổi quyền', 500); }
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
  },

  // --- Tin Tức ---
  getAllNews: async (req: Request, res: Response) => {
    try {
      const news = await adminService.getAllNews();
      return success(res, { news }, 'Tải danh sách bài viết thành công');
    } catch (err) { return error(res, 'Sự cố máy chủ', 500); }
  },
  createNews: async (req: Request, res: Response) => {
    try {
      const created = await adminService.createNews(req.body);
      return success(res, { news: created }, 'Đăng tải bản tin mới thành công');
    } catch (err) { return error(res, 'Sự cố tạo mới', 500); }
  },
  updateNews: async (req: Request, res: Response) => {
    try {
      await adminService.updateNews(Number(req.params.id), req.body);
      return success(res, null, 'Chỉnh sửa bản tin thành công');
    } catch (err) { return error(res, 'Sự cố cập nhật', 500); }
  },
  deleteNews: async (req: Request, res: Response) => {
    try {
      await adminService.deleteNews(Number(req.params.id));
      return success(res, null, 'Xóa bản tin thành công');
    } catch (err) { return error(res, 'Sự cố xóa dữ liệu', 500); }
  }
};
