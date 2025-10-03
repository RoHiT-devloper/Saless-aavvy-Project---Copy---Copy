// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sign_in from "./pages/Sign_in";
import Sign_up from "./pages/Sign_up";
import Customer_home from "./customer_page/CustomerPage";
import Welcome from "./pages/Welcome";
import Add_Product from './productmanager/Add_Product';
import Delete_Product from "./productmanager/Delete_Product";
import Update_Product from './productmanager/Update_Product';
import View_User from './user/View_User';
import Show_All_Product from './productmanager/Show_All_Product';
import Search_Product from './productmanager/Search_Product';
import Product_Manager from './admin/Product_Manager';
import Admin_home from './admin/Admin_Home";
import Delete_User from './user/Delete_User';
import Header from './header/Header';
import User_Management from './user/User_Management';
import CartPage from './cart/CartPage';
import AccessDenied from './pages/AccessDenied";
import './app.css';
import ForgotPassword from './forgotpassword/ForgotPassword';
import AdminOrders from './pages/AdminOrders';
import ProductReviews from './components/ProductReviews';
import Wishlist from './components/Wishlist';
import AddressManager from './components/AddressManager";
import AdminAnalytics from './admin/AdminAnalytics';
import IndexPage from './pages/IndexPage';

function App() {
  const location = useLocation();
  
  // Define paths where header should NOT be shown
  const noHeaderPaths = ['/', '/signin', '/signup', '/access-denied', '/welcome'];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  return (
    <div className="app">
      {/* Show header only on specific pages */}
      {showHeader && <Header />}
      
      <div className="app-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/signin" element={<Sign_in />} />
          <Route path="/signup" element={<Sign_up />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer Routes - Now Public */}
          <Route path="/customer" element={<Customer_home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/addresses" element={<AddressManager />} />
                    
          {/* Admin Routes - Now Public */}
          <Route path="/admin" element={<Admin_home />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/productManager" element={<Product_Manager />} />
          <Route path="/addProduct" element={<Add_Product />} />
          <Route path="/deleteProduct" element={<Delete_Product />} />
          <Route path="/updateProduct" element={<Update_Product />} />
          <Route path="/showAllProducts" element={<Show_All_Product />} />
          <Route path="/searchProduct" element={<Search_Product />} />
          <Route path="/userManagement" element={<User_Management />} />
          <Route path="/show-users" element={<View_User />} />
          <Route path="/delete-users" element={<Delete_User />} />
          <Route path="/product/:id/reviews" element={<ProductReviews />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;