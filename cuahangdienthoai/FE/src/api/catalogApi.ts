
// FILE: catalogApi.ts - WRAPPER API CATALOG (PUBLIC)
// ------------------------------------------------------------



import axiosClient from './axiosClient';

const catalogApi = {
  // Danh sách danh mục (Điện thoại, Phụ kiện, ...)
  getCategories: () => {
    return axiosClient.get('/categories');
  },

  // Danh sách thương hiệu (Apple, Samsung, ...)
  getBrands: () => {
    return axiosClient.get('/brands');
  },

  // Danh sách sản phẩm có hỗ trợ filter + paginate
  // params ví dụ: { page:1, pageSize:12, keyword:'iphone', categoryId:1, brandId:2,
  //                 minPrice:5000000, maxPrice:20000000, sortBy:'price-asc' }
  getProducts: (params?: any) => {
    return axiosClient.get('/products', { params });
  },

  // Chi tiết 1 sản phẩm theo slug (URL-friendly)
  getProductBySlug: (slug: string) => {
    return axiosClient.get(`/products/${slug}`);
  },

  // Flash sale đang chạy (BE trả null nếu không có)
  getActiveFlashSale: () => {
    return axiosClient.get('/flash-sale');
  },

  // Các "dải sản phẩm" trang chủ theo brand
  getDaiSanPham: () => {
    return axiosClient.get('/dai-san-pham');
  }
};

export default catalogApi;
