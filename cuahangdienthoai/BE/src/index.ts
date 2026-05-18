

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getConnection } from './config/db';
import authRoutes from './routes/authRoutes';
import catalogRoutes from './routes/catalogRoutes';

// Nạp biến môi trường từ file .env (DB_SERVER, JWT_SECRET, EMAIL_USER...)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;   // Cổng server, mặc định 5000


app.use(cors());            // Cho phép FE (port 3000) gọi API BE (port 5000)
app.use(express.json());    // Tự parse body JSON -> object trong req.body



// 1) /api/auth/* - Đăng ký, đăng nhập, OTP, Google login (KHÔNG cần token)
app.use('/api/auth', authRoutes);

// 2) /api/user/* - Giỏ hàng, đặt hàng, địa chỉ (BẮT BUỘC đăng nhập)
import checkoutRoutes from './routes/checkoutRoutes';
app.use('/api/user', checkoutRoutes);

// 3) /api/admin/* - CMS quản trị viên (BẮT BUỘC role = Admin)
import adminRoutes from './routes/adminRoutes';
app.use('/api/admin', adminRoutes);


app.use('/api', catalogRoutes);


app.get('/health', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT @@VERSION as version');
    res.json({
      status: 'OK',
      message: 'Server Express Monolith đang chạy trơn tru!',
      databaseConnected: true,
      sqlVersion: result.recordset[0].version
    });
  } catch (error) {
    res.status(500).json({
        status: 'ERROR',
        message: 'Không kết nối được SQL Server, hãy kiểm tra thông tin trong .env',
        error: String(error)
    });
  }
});


app.listen(PORT, () => {
  console.log(` [Backend Monolith]: Server is listening at http://localhost:${PORT}`);
});
