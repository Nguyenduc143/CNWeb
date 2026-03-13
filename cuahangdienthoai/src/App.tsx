import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import CategoryBar from './components/layout/CategoryBar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import NotFoundPage from './pages/NotFoundPage';
import { iphoneProducts, samsungProducts } from './data/products';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <CategoryBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/iphone"
            element={<ProductListPage title="iPhone" icon="🍎" products={iphoneProducts} />}
          />
          <Route
            path="/samsung"
            element={<ProductListPage title="Samsung Galaxy" icon="📟" products={samsungProducts} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

