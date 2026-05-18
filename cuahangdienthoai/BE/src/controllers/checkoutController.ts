

import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { checkoutService } from '../services/checkoutService';
import { success, error } from '../utils/response';


// GET /api/user/addresses - Lấy danh sách địa chỉ giao hàng

export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;  // "!" vì đã chắc chắn có req.user nhờ requireAuth
    const addresses = await checkoutService.getAddresses(userId);
    return success(res, { addresses }, 'Lấy danh sách địa chỉ thành công');
  } catch (err: any) {
    console.error('getAddresses err:', err);
    return error(res, 'Sự cố kết nối sổ địa chỉ', 500);
  }
};


// POST /api/user/addresses - Thêm địa chỉ mới vào sổ
// Body: { fullName, phone, addressLine, ward, district, province, note }

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


// DELETE /api/user/addresses/:id - Xoá địa chỉ
// (Service có check userId để user không xoá địa chỉ của người khác)

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

    // Validate cơ bản: phải có địa chỉ + ít nhất 1 sản phẩm
    if (!payload.addressId || !payload.items || payload.items.length === 0) {
      return error(res, 'Dữ liệu giỏ hàng hoặc địa chỉ không hợp lệ', 400);
    }

    // Service sẽ chạy stored procedure sp_CreateOrder trong TRANSACTION
    // (đảm bảo: hoặc tạo đơn + chi tiết đầy đủ, hoặc rollback toàn bộ)
    const orderRes = await checkoutService.createOrder(userId, payload);
    return success(res, { order: orderRes }, 'Đơn đặt hàng đã được khởi tạo thành công');
  } catch (err: any) {
    console.error('createOrder err:', err);
    return error(res, 'Hệ thống gián đoạn khi xử lý hóa đơn', 500);
  }
};


// GET /api/user/orders/history - Lịch sử đơn hàng của user

export const getOrderHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await checkoutService.getOrdersHist(userId);
    return success(res, { orders });
  } catch (err) {
    return error(res, 'Lỗi trích xuất lịch sử', 500);
  }
};


// GET /api/user/orders/history/:id - Chi tiết 1 đơn hàng
// Service truyền userId vào SP để đảm bảo user chỉ xem được đơn của mình

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


// PUT /api/user/orders/:id/cancel - Huỷ đơn hàng

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const result = await checkoutService.cancelOrder(userId, id);
    if (!result || result.Success === 0) {
      // SP trả Success=0 khi không cho huỷ (đã giao, đã hoàn thành, ...)
      return error(res, result?.Message || 'Không thể hủy đơn hàng', 400);
    }
    return success(res, null, result.Message);
  } catch (err) {
    return error(res, 'Lỗi cập nhật CSDL hủy đơn', 500);
  }
};
