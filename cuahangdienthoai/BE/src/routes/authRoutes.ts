import { Router } from 'express';
import { register, login, me, updateMe } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
// Đổi lại router gốc theo thiết kế tham khảo từ bạn
router.get('/me', requireAuth, me as any);
router.put('/me', requireAuth, updateMe as any);

export default router;
