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
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('✅ Kết nối CSDL SQL bằng tài khoản sa thành công!');
    return pool;
  } catch (error) {
    console.error('❌ Failed to connect to Database:', error);
    throw error;
  }
};
