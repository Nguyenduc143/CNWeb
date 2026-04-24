import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManager from './pages/admin/ProductManager';
import CategoryManager from './pages/admin/CategoryManager';
import BrandManager from './pages/admin/BrandManager';
import OrderManager from './pages/admin/OrderManager';
import UserManager from './pages/admin/UserManager';
import NewsManager from './pages/admin/NewsManager'; // Cập nhật module
import AboutPage from './pages/AboutPage';
import { useScrollTop } from './hooks/useScrollTop';
import './index.css';

const StorefrontLayout = () => {
  useScrollTop(); // Gọi Hook Cuộn Đầu Trang

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Nhánh 1: Cửa hàng Public */}
            <Route path="/" element={<StorefrontLayout />}>
              <Route index element={<HomePage />} />
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
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="/danh-muc/:id" element={<ProductListPage title="Danh Mục" icon={<ion-icon name="grid-outline"></ion-icon>} />} />
              <Route path="/tim-kiem" element={<ProductListPage title="Tìm Kiếm" icon={<ion-icon name="search-outline"></ion-icon>} />} />
              <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
              <Route path="/tin-tuc" element={<NewsPage />} />
              <Route path="/gioi-thieu" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Nhánh 2: Admin Panel - Tách biệt hoàn toàn Header Footer cũ */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="brands" element={<BrandManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="users" element={<UserManager />} />
              <Route path="news" element={<NewsManager />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

