import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom Hook: useScrollTop
 * Lắng nghe sự thay đổi của đường dẫn (URL).
 * Tự động cuộn trang (scroll) trơn tru lên trên cùng mỗi khi người dùng
 * điều hướng sang một Trang (Route) mới.
 */
export const useScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
};
