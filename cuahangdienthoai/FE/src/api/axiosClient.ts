import axios from 'axios';

const axiosClient = axios.create({
  // Thay đổi domain theo BE của bạn
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Tự động đính kèm Token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor cho Response: Rút trích data và xử lý lỗi global
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ lấy phần data của axios trả về
    return response.data;
  },
  (error) => {
    // Nơi bạn có thể log out user nếu API báo lỗi 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosClient;
