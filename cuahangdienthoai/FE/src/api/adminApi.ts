import axiosClient from './axiosClient';

const adminApi = {
  getDashboardStats: () => {
    return axiosClient.get('/admin/dashboard/stats');
  },
  // --- Danh Mục ---
  getCategories: () => {
    return axiosClient.get('/admin/categories');
  },
  createCategory: (data: any) => {
    return axiosClient.post('/admin/categories', data);
  },
  updateCategory: (id: number, data: any) => {
    return axiosClient.put(`/admin/categories/${id}`, data);
  },
  deleteCategory: (id: number) => {
    return axiosClient.delete(`/admin/categories/${id}`);
  },
  // --- Đơn Hàng ---
  getOrders: () => {
    return axiosClient.get('/admin/orders');
  },
  updateOrderStatus: (id: string, status: number) => {
    return axiosClient.put(`/admin/orders/${id}/status`, { status });
  },
  // --- Thành Viên ---
  getUsers: () => {
    return axiosClient.get('/admin/users');
  },
  toggleUserLock: (id: string, isLocked: boolean) => {
    return axiosClient.put(`/admin/users/${id}/lock`, { isLocked });
  },
  changeUserRole: (id: string, role: string) => {
    return axiosClient.put(`/admin/users/${id}/role`, { role });
  },
  // --- Sản Phẩm ---
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
