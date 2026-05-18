// FILE: adminApi.ts - WRAPPER API CHO TOÀN BỘ ADMIN CMS

import axiosClient from './axiosClient';

const adminApi = {
  // ----- Dashboard thống kê -----
  getDashboardStats: () => {
    return axiosClient.get('/admin/dashboard/stats');
  },

  // ----- Danh Mục (CRUD) -----
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

  // ----- Thương Hiệu (CRUD) -----
  getBrands: () => {
    return axiosClient.get('/admin/brands');
  },
  createBrand: (data: any) => {
    return axiosClient.post('/admin/brands', data);
  },
  updateBrand: (id: number, data: any) => {
    return axiosClient.put(`/admin/brands/${id}`, data);
  },
  deleteBrand: (id: number) => {
    return axiosClient.delete(`/admin/brands/${id}`);
  },

  // ----- Đơn Hàng (chỉ xem + đổi trạng thái) -----
  getOrders: () => {
    return axiosClient.get('/admin/orders');
  },
  updateOrderStatus: (id: string, status: number) => {
    return axiosClient.put(`/admin/orders/${id}/status`, { status });
  },

  // ----- Thành Viên -----
  getUsers: () => {
    return axiosClient.get('/admin/users');
  },
  toggleUserLock: (id: string, isLocked: boolean) => {
    return axiosClient.put(`/admin/users/${id}/lock`, { isLocked });
  },
  changeUserRole: (id: string, role: string) => {
    return axiosClient.put(`/admin/users/${id}/role`, { role });
  },

  // ----- Sản Phẩm (CRUD) -----
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
  },

  // ----- Flash Sale (sự kiện + sản phẩm tham gia) -----
  getFlashSales: () => {
    return axiosClient.get('/admin/flash-sales');
  },
  getFlashSaleDetail: (id: number) => {
    return axiosClient.get(`/admin/flash-sales/${id}`);
  },
  createFlashSale: (data: any) => {
    return axiosClient.post('/admin/flash-sales', data);
  },
  updateFlashSale: (id: number, data: any) => {
    return axiosClient.put(`/admin/flash-sales/${id}`, data);
  },
  deleteFlashSale: (id: number) => {
    return axiosClient.delete(`/admin/flash-sales/${id}`);
  },
  // Thêm 1 sản phẩm vào sự kiện flash sale (kèm giá ưu đãi)
  addFlashSaleItem: (data: any) => {
    return axiosClient.post('/admin/flash-sales/items', data);
  },
  removeFlashSaleItem: (itemId: number) => {
    return axiosClient.delete(`/admin/flash-sales/items/${itemId}`);
  },

  // ----- Tin Tức (CRUD) -----
  getNews: () => {
    return axiosClient.get('/admin/news');
  },
  createNews: (data: any) => {
    return axiosClient.post('/admin/news', data);
  },
  updateNews: (id: number, data: any) => {
    return axiosClient.put(`/admin/news/${id}`, data);
  },
  deleteNews: (id: number) => {
    return axiosClient.delete(`/admin/news/${id}`);
  },

  // ----- Banner (CRUD) -----
  getBanners: () => {
    return axiosClient.get('/admin/banners');
  },
  createBanner: (data: any) => {
    return axiosClient.post('/admin/banners', data);
  },
  updateBanner: (id: number, data: any) => {
    return axiosClient.put(`/admin/banners/${id}`, data);
  },
  deleteBanner: (id: number) => {
    return axiosClient.delete(`/admin/banners/${id}`);
  },

  // ----- Dải Sản Phẩm Trang Chủ (CRUD) -----
  getDaiSanPham: () => {
    return axiosClient.get('/admin/dai-san-pham');
  },
  createDaiSanPham: (data: any) => {
    return axiosClient.post('/admin/dai-san-pham', data);
  },
  updateDaiSanPham: (id: number, data: any) => {
    return axiosClient.put(`/admin/dai-san-pham/${id}`, data);
  },
  deleteDaiSanPham: (id: number) => {
    return axiosClient.delete(`/admin/dai-san-pham/${id}`);
  },
};

export default adminApi;
