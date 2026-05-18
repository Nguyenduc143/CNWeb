
// FILE: checkoutApi.ts - WRAPPER API CHECKOUT & ĐỊA CHỈ


import axiosClient from './axiosClient';

const checkoutApi = {
  // ----- Sổ địa chỉ giao hàng -----
  getAddresses: () => {
    return axiosClient.get('/user/addresses');
  },
  addAddress: (data: any) => {
    return axiosClient.post('/user/addresses', data);
  },
  deleteAddress: (id: string) => {
    return axiosClient.delete(`/user/addresses/${id}`);
  },

  // ----- Đặt hàng & xem lịch sử -----
  // data ví dụ: { addressId, subtotal, total, paymentMethod, items: [...] }
  createOrder: (data: any) => {
    return axiosClient.post('/user/orders', data);
  },

  // Lịch sử các đơn của user hiện tại
  getOrderHistory: () => {
    return axiosClient.get('/user/orders/history');
  },

  // Chi tiết 1 đơn (BE check user_id để chỉ trả đơn của chính họ)
  getOrderDetails: (id: string) => {
    return axiosClient.get(`/user/orders/history/${id}`);
  },

  // Huỷ đơn (chỉ huỷ được khi đơn đang chờ xác nhận)
  cancelOrder: (id: string) => {
    return axiosClient.put(`/user/orders/${id}/cancel`);
  }
};

export default checkoutApi;
