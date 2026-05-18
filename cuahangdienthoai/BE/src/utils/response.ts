
import { Response } from 'express';

/**
 * Trả về response thành công (HTTP 200).
 * @param res     - Đối tượng Response của Express
 * @param data    - Object dữ liệu (sẽ được spread vào body)
 * @param message - Thông báo thành công (mặc định 'Success')
 */
export const success = (res: Response, data: any, message = 'Success') => {
  return res.status(200).json({
    status: 'success',
    message,
    ...data           // ví dụ data = { user: {...} } -> body có trường "user"
  });
};

/**
 * Trả về response lỗi.
 * @param res        - Đối tượng Response của Express
 * @param message    - Thông báo lỗi
 * @param statusCode - Mã HTTP (mặc định 500 = lỗi server)
 *                     400 = Bad Request, 401 = Unauthorized,
 *                     403 = Forbidden, 404 = Not Found
 */
export const error = (res: Response, message: string, statusCode = 500) => {
  return res.status(statusCode).json({
    status: 'error',
    message
  });
};
