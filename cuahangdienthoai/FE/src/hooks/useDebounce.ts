import { useState, useEffect } from 'react';

/**
 * Custom Hook: useDebounce
 * Dùng để trì hoãn việc cập nhật giá trị liên tục trong một khoảng thời gian (delay).
 * Rất thường dùng để tối ưu hóa Thanh Tìm Kiếm (Search Bar), giúp tránh việc
 * gọi API liên tục mỗi khi người dùng gõ 1 phím. 
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Đặt bộ đếm thời gian cập nhật giá trị
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy bỏ bộ đếm thời gian nếu value hoặc delay thay đổi (người dùng gõ tiếp phím)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
