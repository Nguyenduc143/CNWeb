// ============================================================
// FILE: CartContext.tsx - QUẢN LÝ GIỎ HÀNG TOÀN CỤC (Context API)

// Dùng React Context API thay vì Redux vì giỏ hàng không quá phức tạp.


// Cách dùng ở component khác:
//   const { cart, addToCart, cartTotal } = useCart();


import React, { createContext, useContext, useState, useEffect } from 'react';


// TYPE: 1 mục trong giỏ hàng
// ------------------------------------------------------------
export interface CartItem {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

// ------------------------------------------------------------
// TYPE: Hình dạng dữ liệu mà Context cung cấp ra ngoài
// ------------------------------------------------------------
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
}

// Tạo Context với initial = undefined để bắt lỗi khi dùng ngoài Provider
const CartContext = createContext<CartContextType | undefined>(undefined);

// ------------------------------------------------------------
// PROVIDER: bọc App, cung cấp state cart cho mọi component con
// ------------------------------------------------------------
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ----- LOAD giỏ từ LocalStorage khi component mount lần đầu -----
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        // LocalStorage có thể bị hỏng dữ liệu -> bỏ qua
        console.error('Error parsing cart from storage', e);
      }
    }
  }, []); // Chạy 1 lần duy nhất

  // ----- TỰ ĐỘNG SAVE giỏ vào LocalStorage mỗi khi cart thay đổi -----
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }, [cart]); // Chạy mỗi lần cart đổi

  // ------------------------------------------------------------
  // CÁC HÀM THAO TÁC GIỎ HÀNG
  // ------------------------------------------------------------

  // Thêm sản phẩm vào giỏ; nếu đã có thì cộng dồn quantity
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.productId === item.productId);
      if (existing) {
        // Đã có -> cộng quantity
        return prev.map((x) =>
          x.productId === item.productId
            ? { ...x, quantity: x.quantity + item.quantity }
            : x
        );
      }
      // Chưa có -> thêm vào cuối
      return [...prev, item];
    });
  };

  // Xoá hẳn 1 sản phẩm khỏi giỏ
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((x) => x.productId !== productId));
  };

  // Cập nhật số lượng (chặn không cho < 1 để tránh quantity âm)
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((x) => (x.productId === productId ? { ...x, quantity } : x))
    );
  };

  // Dọn sạch giỏ (gọi sau khi đặt hàng thành công)
  const clearCart = () => setCart([]);

  // ----- DERIVED STATE: tính từ cart, không cần lưu thêm -----
  // Tổng tiền = tổng (giá × số lượng) của mọi item
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Tổng số sản phẩm trong giỏ (cộng dồn quantity)
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ------------------------------------------------------------
// CUSTOM HOOK: useCart()
// Bao bọc useContext để bắt lỗi nếu dùng ngoài <CartProvider>
// và để code component gọn hơn.
// ------------------------------------------------------------
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
