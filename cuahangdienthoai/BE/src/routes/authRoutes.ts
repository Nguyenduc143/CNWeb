import { Router } from 'express';
import { register, login, me, updateMe, forgotPassword, resetPasswordWithOTP, changePassword, googleLogin, verifyOTP, sendChangePasswordOTP } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordWithOTP);
// Đổi lại router gốc theo thiết kế tham khảo từ bạn
router.get('/me', requireAuth, me as any);
router.put('/me', requireAuth, updateMe as any);
router.post('/me/send-otp', requireAuth, sendChangePasswordOTP as any);
router.put('/me/change-password', requireAuth, changePassword as any);

export default router;
