

import sql from 'mssql';                  // Thư viện chính thức kết nối SQL Server
import dotenv from 'dotenv';               // Đọc biến môi trường từ file .env
dotenv.config();                            // Nạp .env ngay khi file này được import

// Object cấu hình kết nối, các giá trị nhạy cảm đều lấy từ .env
const dbConfig: sql.config = {
  server: process.env.DB_SERVER || 'localhost',          // Địa chỉ SQL Server
  port: parseInt(process.env.DB_PORT || '1433'),         // Cổng mặc định SQL Server
  user: process.env.DB_USER || 'sa',                     // Tài khoản DB
  password: process.env.DB_PASSWORD || '',               // Mật khẩu DB (KHÔNG hardcode)
  database: process.env.DB_NAME || 'CHDT',               // Tên database (Cua Hang Dien Thoai)
  options: {
    encrypt: true,                   // SmarterASP/Azure yêu cầu TLS, local server thì vẫn chạy ổn
    trustServerCertificate: true,    // Cho phép self-signed cert (host thường dùng)
  },
  pool: {
    max: 10,                         // Tối đa 10 kết nối song song
    min: 0,                          // Không giữ kết nối nào khi rảnh
    idleTimeoutMillis: 30000,        // Kết nối rảnh > 30s sẽ bị đóng
  },
};


let poolPromise: Promise<sql.ConnectionPool> | null = null;


export const getConnection = async (): Promise<sql.ConnectionPool> => {
  if (!poolPromise) {
    // Chưa có pool -> tạo mới
    poolPromise = sql.connect(dbConfig)
      .then(pool => {
        console.log('✅ Kết nối CSDL SQL thành công! Pool sẵn sàng.');
        return pool;
      })
      .catch(err => {
        // Reset về null để lần gọi sau có cơ hội thử lại (chứ không kẹt mãi ở promise lỗi)
        poolPromise = null;
        console.error('❌ Kết nối CSDL thất bại:', err);
        throw err;
      });
  }
  return poolPromise;
};
