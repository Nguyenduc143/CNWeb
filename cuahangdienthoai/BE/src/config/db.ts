import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'CHDT',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Singleton pool - chỉ tạo 1 lần duy nhất, tái sử dụng cho mọi request
let poolPromise: Promise<sql.ConnectionPool> | null = null;

export const getConnection = async (): Promise<sql.ConnectionPool> => {
  if (!poolPromise) {
    poolPromise = sql.connect(dbConfig)
      .then(pool => {
        console.log('✅ Kết nối CSDL SQL thành công! Pool sẵn sàng.');
        return pool;
      })
      .catch(err => {
        poolPromise = null; // Reset để cho phép thử lại
        console.error('❌ Kết nối CSDL thất bại:', err);
        throw err;
      });
  }
  return poolPromise;
};
