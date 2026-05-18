

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Lưu ý: Nếu thiếu JWT_SECRET trong .env thì fallback - production phải bỏ fallback này
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';


export interface AuthRequest extends Request {
  user?: any;
}


// ------------------------------------------------------------
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Lấy header "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  // Không có header hoặc không bắt đầu bằng "Bearer " -> từ chối
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Truy cập bị từ chối! Không tìm thấy Token hợp lệ.' });
    return;
  }

  // Tách lấy phần token thực sự (bỏ chữ "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Giải mã + xác thực chữ ký token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Gắn payload vào request, controller sau dùng được
    next();              // Cho phép đi tiếp tới controller
  } catch (error) {
    // Token sai chữ ký, hết hạn, hoặc bị sửa đổi
    res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn hoặc Token bị làm giả.' });
  }
};


export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'Admin') {
    // 403 = đã đăng nhập rồi nhưng KHÔNG có quyền (khác với 401 = chưa đăng nhập)
    res.status(403).json({ message: 'Truy cập bị từ chối! Bạn không có quyền Quản trị viên (Admin).' });
    return;
  }
  next();
};
