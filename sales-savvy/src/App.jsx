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
import Admin_home from './admin/Admin_Home';
import Delete_User from './user/Delete_User';
import Header from './header/Header';
import User_Management from './user/User_Management';
import CartPage from './cart/CartPage';
import ProtectedRoute from './utils/ProtectedRoute';
import AccessDenied from './pages/AccessDenied';
import './App.css';
import ForgotPassword from './forgotpassword/ForgotPassword';
import AdminOrders from './pages/AdminOrders';
import ProductReviews from './components/ProductReviews';
import Wishlist from './components/Wishlist';
import AddressManager from './components/AddressManager';
import AdminAnalytics from './admin/AdminAnalytics';
import IndexPage from './pages/IndexPage';

function App() {
  const location = useLocation();
  
  // Define paths where header should NOT be shown
  const noHeaderPaths = ['/', '/signin', '/signup', '/access-denied'];
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

          {/* Customer Routes - Protected */}
          <Route 
            path="/customer" 
            element={
              <ProtectedRoute requiredRole="customer">
                <Customer_home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute requiredRole="customer">
                <CartPage />
              </ProtectedRoute>
            } 
          />

          <Route 
              path="/wishlist" 
              element={
                  <ProtectedRoute requiredRole="customer">
                      <Wishlist />
                  </ProtectedRoute>
              } 
          />
          <Route 
              path="/addresses" 
              element={
                  <ProtectedRoute requiredRole="customer">
                      <AddressManager />
                  </ProtectedRoute>
              } 
          />
                    
          {/* Admin Routes - Protected */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin_home />
              </ProtectedRoute>
            } 
          />
          <Route 
              path="/admin/analytics" 
              element={
                  <ProtectedRoute requiredRole="admin">
                      <AdminAnalytics />
                  </ProtectedRoute>
              } 
          />
          <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminOrders />
                </ProtectedRoute>
              } 
            />
          <Route 
            path="/productManager" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Product_Manager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addProduct" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Add_Product />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/deleteProduct" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Delete_Product />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/updateProduct" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Update_Product />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/showAllProducts" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Show_All_Product />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/searchProduct" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Search_Product />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/userManagement" 
            element={
              <ProtectedRoute requiredRole="admin">
                <User_Management />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/show-users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <View_User />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/delete-users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Delete_User />
              </ProtectedRoute>
            } 
          />
          <Route 
              path="/product/:id/reviews" 
              element={<ProductReviews />} 
          />
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;