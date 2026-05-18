
// FILE: App.tsx - THIẾT LẬP ROUTING & PROVIDER TOÀN CỤC


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// === Storefront pages ===
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import NewsPage from './pages/NewsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ProfilePage from './pages/user/ProfilePage';
import CartPage from './pages/checkout/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';

// === Admin pages ===
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManager from './pages/admin/ProductManager';
import CategoryManager from './pages/admin/CategoryManager';
import BrandManager from './pages/admin/BrandManager';
import OrderManager from './pages/admin/OrderManager';
import UserManager from './pages/admin/UserManager';
import NewsManager from './pages/admin/NewsManager';
import FlashSaleManager from './pages/admin/FlashSaleManager';
import BannerManager from './pages/admin/BannerManager';
import BrandSectionManager from './pages/admin/BrandSectionManager';

import AboutPage from './pages/AboutPage';
import { useScrollTop } from './hooks/useScrollTop';
import './index.css';


// LAYOUT cho nhánh STOREFRONT (Header + Footer ngoài cùng,
// nội dung từng page render vào <Outlet />)

const StorefrontLayout = () => {
  useScrollTop();  // Custom hook: tự cuộn lên đầu trang khi đổi route

  return (
    <>
      <Header />
      <Outlet />     {/* React Router thay thế Outlet bằng page con */}
      <Footer />
    </>
  );
};

function App() {
  return (
    // CartProvider bọc toàn app -> mọi component đều dùng được useCart()
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* ==============================================
                NHÁNH 1: STOREFRONT (PUBLIC)
                Mọi route nằm trong block này dùng StorefrontLayout
                ============================================== */}
            <Route path="/" element={<StorefrontLayout />}>
              {/* index = trang mặc định khi vào "/" */}
              <Route index element={<HomePage />} />

              {/* Trang danh sách SP có brandId cố định (truyền props) */}
              <Route
                path="/iphone"
                element={<ProductListPage title="iPhone" icon={<ion-icon name="logo-apple"></ion-icon>} brandId={1} />}
              />
              <Route
                path="/flash-sale"
                element={<ProductListPage title="Flash Sale Hôm Nay" icon={<ion-icon name="flash-outline"></ion-icon>} />}
              />
              <Route
                path="/samsung"
                element={<ProductListPage title="Samsung Galaxy" icon={<ion-icon name="phone-portrait-outline"></ion-icon>} brandId={2} />}
              />
              <Route
                path="/xiaomi"
                element={<ProductListPage title="Xiaomi" icon={<ion-icon name="hardware-chip-outline"></ion-icon>} brandId={4} />}
              />
              <Route
                path="/oppo"
                element={<ProductListPage title="Oppo" icon={<ion-icon name="color-palette-outline"></ion-icon>} brandId={3} />}
              />
              <Route
                path="/products"
                element={<ProductListPage title="Tất Cả Sản Phẩm" icon={<ion-icon name="grid-outline"></ion-icon>} />}
              />

              {/* Auth flow */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />

              {/* User flow (lưu ý: chưa có guard, cần PrivateRoute) */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />

              {/* Routes có tham số động (:id, :slug) */}
              <Route path="/danh-muc/:id" element={<ProductListPage title="Danh Mục" icon={<ion-icon name="grid-outline"></ion-icon>} />} />
              <Route path="/tim-kiem" element={<ProductListPage title="Tìm Kiếm" icon={<ion-icon name="search-outline"></ion-icon>} />} />
              <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
              <Route path="/tin-tuc" element={<NewsPage />} />
              <Route path="/gioi-thieu" element={<AboutPage />} />

              {/* "*" = catch-all, hiển thị NotFoundPage cho URL không khớp */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* ==============================================
                NHÁNH 2: ADMIN PANEL (CMS)
                Tách hoàn toàn khỏi storefront -> không có Header/Footer
                AdminLayout có guard kiểm tra JWT + role = Admin
                ============================================== */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="brands" element={<BrandManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="users" element={<UserManager />} />
              <Route path="news" element={<NewsManager />} />
              <Route path="flash-sale" element={<FlashSaleManager />} />
              <Route path="banners" element={<BannerManager />} />
              <Route path="brand-sections" element={<BrandSectionManager />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
