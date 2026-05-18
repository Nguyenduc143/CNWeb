
// FILE: axiosClient.ts - CẤU HÌNH AXIOS DÙNG CHUNG CHO TOÀN APP



import axios from 'axios';

const axiosClient = axios.create({
  // baseURL ưu tiên lấy từ biến môi trường, fallback về localhost
  // Khi build production cần đặt REACT_APP_API_URL=https://your-api-domain
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


// INTERCEPTOR REQUEST: chạy trước MỖI request gửi đi
// Tự động gắn token vào header Authorization nếu có
// (Cách này giúp các trang không phải tự gắn token thủ công)
// ------------------------------------------------------------
axiosClient.interceptors.request.use((config) => {
  // Lấy token từ localStorage hoặc sessionStorage
  // (login thường lưu ở localStorage; "remember me" có thể đẩy lên session)
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  if (token && config.headers) {
    // Format chuẩn theo OAuth 2.0: "Bearer <token>"
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// INTERCEPTOR RESPONSE: chạy sau MỖI response nhận về
//   - Bóc lấy phần body (axios trả về { data, status, headers })
//     -> các trang chỉ cần dùng res.products thay vì res.data.products
//   - Xử lý 401 toàn cục: token hết hạn -> xoá token (có thể redirect về login)

axiosClient.interceptors.response.use(
  (response) => {
    // Bỏ wrapper, chỉ trả về body JSON cho các page
    return response.data;
  },
  (error) => {
    // 401 = token sai/hết hạn -> đăng xuất user
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      // Có thể bật để tự redirect: window.location.href = '/login';
    }
    // Reject với message của BE để FE hiển thị (ưu tiên message từ server)
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosClient;
