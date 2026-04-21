import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { checkoutService } from '../services/checkoutService';
import { success, error } from '../utils/response';

export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const addresses = await checkoutService.getAddresses(userId);
    return success(res, { addresses }, 'Lấy danh sách địa chỉ thành công');
  } catch (err: any) {
    console.error('getAddresses err:', err);
    return error(res, 'Sự cố kết nối sổ địa chỉ', 500);
  }
};

export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const newAddr = await checkoutService.addAddress(userId, req.body);
    return success(res, { address: newAddr }, 'Thêm mới địa chỉ hoàn tất');
  } catch (err: any) {
    console.error('addAddress err:', err);
    return error(res, 'Lỗi cập nhật địa chỉ', 500);
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    await checkoutService.deleteAddress(userId, id);
    return success(res, null, 'Đã xóa bỏ địa chỉ liên hệ');
  } catch (err) {
    return error(res, 'Xóa thất bại', 500);
  }
}

export const checkoutOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const payload = req.body;
    
    if (!payload.addressId || !payload.items || payload.items.length === 0) {
      return error(res, 'Dữ liệu giỏ hàng hoặc địa chỉ không hợp lệ', 400);
    }
    
    const orderRes = await checkoutService.createOrder(userId, payload);
    return success(res, { order: orderRes }, 'Đơn đặt hàng đã được khởi tạo thành công');
  } catch (err: any) {
    console.error('createOrder err:', err);
    return error(res, 'Hệ thống gián đoạn khi xử lý hóa đơn', 500);
  }
};

export const getOrderHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await checkoutService.getOrdersHist(userId);
    return success(res, { orders });
  } catch (err) {
    return error(res, 'Lỗi trích xuất lịch sử', 500);
  }
};

export const getOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const details = await checkoutService.getOrderDetails(userId, id);
    if (!details) return error(res, 'Hóa đơn không tồn tại', 404);
    
    return success(res, { orderDetails: details });
  } catch (err) {
    return error(res, 'Trình truy xuất chi tiết lỗi', 500);
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const result = await checkoutService.cancelOrder(userId, id);
    if (!result || result.Success === 0) {
      return error(res, result?.Message || 'Không thể hủy đơn hàng', 400);
    }
    return success(res, null, result.Message);
  } catch (err) {
    return error(res, 'Lỗi cập nhật CSDL hủy đơn', 500);
  }
};
