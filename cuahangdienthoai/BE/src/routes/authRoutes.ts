
import { Router } from 'express';
import {
  register, login, me, updateMe,
  forgotPassword, resetPasswordWithOTP,
  changePassword, googleLogin, verifyOTP, sendChangePasswordOTP
} from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();


router.post('/register', register);                       // Đăng ký tài khoản (gửi OTP)
router.post('/verify-otp', verifyOTP);                    // Xác nhận OTP đăng ký
router.post('/login', login);                             // Đăng nhập email + password
router.post('/google-login', googleLogin);                // Đăng nhập bằng Google
router.post('/forgot-password', forgotPassword);          // Gửi OTP quên mật khẩu
router.post('/reset-password', resetPasswordWithOTP);     // Đặt lại MK qua OTP


router.get('/me', requireAuth, me as any);                              // Lấy thông tin user hiện tại
router.put('/me', requireAuth, updateMe as any);                        // Cập nhật profile
router.post('/me/send-otp', requireAuth, sendChangePasswordOTP as any); // Gửi OTP để đổi MK
router.put('/me/change-password', requireAuth, changePassword as any);  // Đổi MK (cần OTP)

export default router;
