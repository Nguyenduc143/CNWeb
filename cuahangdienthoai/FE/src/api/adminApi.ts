import axiosClient from './axiosClient';

const adminApi = {
  getDashboardStats: () => {
    return axiosClient.get('/admin/dashboard/stats');
  },
  getProducts: () => {
    return axiosClient.get('/admin/products');
  },
  createProduct: (data: any) => {
    return axiosClient.post('/admin/products', data);
  },
  updateProduct: (id: string, data: any) => {
    return axiosClient.put(`/admin/products/${id}`, data);
  },
  deleteProduct: (id: string) => {
    return axiosClient.delete(`/admin/products/${id}`);
  }
};

export default adminApi;
