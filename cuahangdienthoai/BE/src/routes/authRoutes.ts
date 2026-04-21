import { Router } from 'express';
import { register, login, me, updateMe, forgotPassword, changePassword } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
// Đổi lại router gốc theo thiết kế tham khảo từ bạn
router.get('/me', requireAuth, me as any);
router.put('/me', requireAuth, updateMe as any);
router.put('/me/change-password', requireAuth, changePassword as any);

export default router;
