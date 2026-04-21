import axiosClient from './axiosClient';

const newsApi = {
  getNewsList(): Promise<any> {
    const url = '/news';
    return axiosClient.get(url);
  },

  getNewsDetail(id: string | number): Promise<any> {
    const url = `/news/${id}`;
    return axiosClient.get(url);
  }
};

export default newsApi;
