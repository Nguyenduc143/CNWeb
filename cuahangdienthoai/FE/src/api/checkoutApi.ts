import axiosClient from './axiosClient';

const checkoutApi = {
  getAddresses: () => {
    return axiosClient.get('/user/addresses');
  },
  addAddress: (data: any) => {
    return axiosClient.post('/user/addresses', data);
  },
  deleteAddress: (id: string) => {
    return axiosClient.delete(`/user/addresses/${id}`);
  },
  createOrder: (data: any) => {
    return axiosClient.post('/user/orders', data);
  },
  getOrderHistory: () => {
    return axiosClient.get('/user/orders/history');
  },
  getOrderDetails: (id: string) => {
    return axiosClient.get(`/user/orders/history/${id}`);
  }
};

export default checkoutApi;
