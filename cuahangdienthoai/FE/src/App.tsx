import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import CategoryBar from './components/layout/CategoryBar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import { iphoneProducts, samsungProducts } from './data/products';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
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
    <Router>
      <div className="App">
        <Routes>
          {/* Nhánh 1: Cửa hàng Public */}
          <Route path="/" element={<StorefrontLayout />}>
            <Route index element={<HomePage />} />
          <Route
            path="/iphone"
            element={<ProductListPage title="iPhone" icon="🍎" products={iphoneProducts} />}
          />
          <Route
            path="/samsung"
            element={<ProductListPage title="Samsung Galaxy" icon="📟" products={samsungProducts} />}
          />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Nhánh 2: Admin Panel - Tách biệt hoàn toàn Header Footer cũ */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

