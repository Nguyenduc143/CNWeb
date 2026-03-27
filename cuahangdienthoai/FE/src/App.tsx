import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import CategoryBar from './components/layout/CategoryBar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import CartPage from './pages/checkout/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManager from './pages/admin/ProductManager';
import './index.css';

const StorefrontLayout = () => {
  return (
    <>
      <Header />
      <CategoryBar />
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
            element={<ProductListPage title="iPhone" icon="🍎" brandId={1} />}
          />
          <Route
            path="/samsung"
            element={<ProductListPage title="Samsung Galaxy" icon="📟" brandId={2} />}
          />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Nhánh 2: Admin Panel - Tách biệt hoàn toàn Header Footer cũ */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManager />} />
          </Route>
        </Routes>
      </div>
      </Router>
    </CartProvider>
  );
}

export default App;

