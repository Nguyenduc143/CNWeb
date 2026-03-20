import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getConnection } from './config/db';
import authRoutes from './routes/authRoutes';
import catalogRoutes from './routes/catalogRoutes';

// Nạp config .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Pass JSON & bật CORS
app.use(cors());
app.use(express.json());

// Nối Route Hệ thống Auth
app.use('/api/auth', authRoutes);

// Mảng API Catalog Mở (Không khóa JWT) truy xuất thẳng từ gốc /api
app.use('/api', catalogRoutes);

// Điểm chẩn đoán hoạt động của Monolith (Giống như entry Gateway)
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

// Chạy server
app.listen(PORT, () => {
  console.log(`🚀 [Backend Monolith]: Server is listening at http://localhost:${PORT}`);
});
