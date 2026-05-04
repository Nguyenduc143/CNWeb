import axiosClient from './axiosClient';

const catalogApi = {
  getCategories: () => {
    return axiosClient.get('/categories');
  },
  getBrands: () => {
    return axiosClient.get('/brands');
  },
  getProducts: (params?: any) => {
    return axiosClient.get('/products', { params });
  },
  getProductBySlug: (slug: string) => {
    return axiosClient.get(`/products/${slug}`);
  },
  getActiveFlashSale: () => {
    return axiosClient.get('/flash-sale');
  }
};

export default catalogApi;
