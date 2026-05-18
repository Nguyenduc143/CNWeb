

import jwt from 'jsonwebtoken';

// Khoá bí mật để KÝ và XÁC THỰC token.
// LƯU Ý BẢO MẬT: Trong production phải đặt JWT_SECRET trong .env,
// không được hardcode vì ai có khoá này có thể giả mạo token.
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

/**
 * Tạo token JWT từ payload (dữ liệu user: id, username, role...).
 * Token có hiệu lực 7 ngày, sau đó hết hạn -> user phải đăng nhập lại.
 */
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Xác thực token: nếu hợp lệ -> trả về payload đã giải mã,
 * nếu hết hạn hoặc bị giả mạo -> ném lỗi (caller cần try/catch).
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
