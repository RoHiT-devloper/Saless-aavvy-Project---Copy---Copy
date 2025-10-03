// src/pages/IndexPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './IndexPage.css';

const IndexPage = () => {
  const pages = [
    // Public Pages
    { path: '/', name: 'Welcome Page', description: 'Landing page for the application' },
    { path: '/signin', name: 'Sign In', description: 'User authentication page' },
    { path: '/signup', name: 'Sign Up', description: 'User registration page' },
    { path: '/forgot-password', name: 'Forgot Password', description: 'Password recovery page' },
    { path: '/access-denied', name: 'Access Denied', description: 'Unauthorized access page' },

    // Customer Pages
    { path: '/customer', name: 'Customer Home', description: 'Main customer dashboard with products' },
    { path: '/cart', name: 'Shopping Cart', description: 'Cart management and checkout' },
    { path: '/wishlist', name: 'Wishlist', description: 'Saved products list' },
    { path: '/addresses', name: 'Address Manager', description: 'Shipping address management' },

    // Admin Pages
    { path: '/admin', name: 'Admin Dashboard', description: 'Administrator main dashboard' },
    { path: '/admin/analytics', name: 'Admin Analytics', description: 'Business analytics and reports' },
    { path: '/admin/orders', name: 'Admin Orders', description: 'Order management system' },
    
    // Product Management
    { path: '/productManager', name: 'Product Manager', description: 'Product management dashboard' },
    { path: '/addProduct', name: 'Add Product', description: 'Add new products to catalog' },
    { path: '/deleteProduct', name: 'Delete Product', description: 'Remove products from catalog' },
    { path: '/updateProduct', name: 'Update Product', description: 'Edit existing products' },
    { path: '/showAllProducts', name: 'Show All Products', description: 'Browse all products' },
    { path: '/searchProduct', name: 'Search Product', description: 'Search products by criteria' },

    // User Management
    { path: '/userManagement', name: 'User Management', description: 'User administration dashboard' },
    { path: '/show-users', name: 'View Users', description: 'Browse all system users' },
    { path: '/delete-users', name: 'Delete Users', description: 'Remove user accounts' },

    // Product Reviews
    { path: '/product/:id/reviews', name: 'Product Reviews', description: 'Customer reviews for products' }
  ];

  const getCategory = (path) => {
    if (path === '/') return 'Public';
    if (path.startsWith('/admin')) return 'Admin';
    if (path.startsWith('/customer') || path === '/cart' || path === '/wishlist' || path === '/addresses') return 'Customer';
    if (path.startsWith('/product') && !path.includes('reviews')) return 'Product Management';
    if (path.startsWith('/user')) return 'User Management';
    if (path.includes('signin') || path.includes('signup') || path.includes('forgot-password') || path.includes('access-denied')) return 'Authentication';
    return 'Other';
  };

  const categorizedPages = pages.reduce((acc, page) => {
    const category = getCategory(page.path);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(page);
    return acc;
  }, {});

  return (
    <div className="index-page-container">
      <div className="index-page-header">
        <h1>🏠 SalesSavvy - Project Index</h1>
        <p className="subtitle">Complete navigation guide for all application pages</p>
        <div className="project-info">
          <p><strong>Built with:</strong> React.js, Spring Boot, PostgreSQL</p>
          <p><strong>Features:</strong> E-commerce, User Management, Analytics, Payment Integration</p>
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-number">{pages.length}</span>
          <span className="stat-label">Total Pages</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{Object.keys(categorizedPages).length}</span>
          <span className="stat-label">Categories</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{categorizedPages['Customer']?.length || 0}</span>
          <span className="stat-label">Customer Pages</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{categorizedPages['Admin']?.length || 0}</span>
          <span className="stat-label">Admin Pages</span>
        </div>
      </div>

      <div className="categories-container">
        {Object.entries(categorizedPages).map(([category, categoryPages]) => (
          <div key={category} className="category-section">
            <h2 className="category-title">
              {getCategoryIcon(category)} {category} Pages
              <span className="page-count">({categoryPages.length})</span>
            </h2>
            <div className="pages-grid">
              {categoryPages.map((page, index) => (
                <div key={page.path} className="page-card">
                  <div className="page-header">
                    <span className="page-number">#{index + 1}</span>
                    <h3 className="page-name">{page.name}</h3>
                  </div>
                  <p className="page-description">{page.description}</p>
                  <div className="page-path">
                    <code>{page.path}</code>
                  </div>
                  <div className="page-actions">
                    <Link to={page.path} className="nav-link primary">
                      🔗 Visit Page
                    </Link>
                    {page.path.includes(':id') && (
                      <Link to="/customer" className="nav-link secondary">
                        📋 View Products First
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="navigation-tips">
        <h3>🚀 Quick Navigation Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>For Customers</h4>
            <p>Start with <Link to="/signup">Sign Up</Link> or <Link to="/signin">Sign In</Link>, then explore <Link to="/customer">products</Link>.</p>
          </div>
          <div className="tip-card">
            <h4>For Admins</h4>
            <p>Use admin credentials to access <Link to="/admin">Admin Dashboard</Link> for full management capabilities.</p>
          </div>
          <div className="tip-card">
            <h4>Test Features</h4>
            <p>Try adding products to cart, wishlist, and test the complete checkout process with Razorpay integration.</p>
          </div>
        </div>
      </div>

      <div className="feature-highlights">
        <h3>⭐ Key Features</h3>
        <div className="features-list">
          <div className="feature-item">🛒 E-commerce Shopping Cart</div>
          <div className="feature-item">💳 Razorpay Payment Integration</div>
          <div className="feature-item">📊 Real-time Analytics</div>
          <div className="feature-item">👥 Role-based Access Control</div>
          <div className="feature-item">❤️ Wishlist Management</div>
          <div className="feature-item">🏠 Address Management</div>
          <div className="feature-item">📦 Order Management</div>
          <div className="feature-item">🔍 Product Search & Filter</div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get icons for categories
const getCategoryIcon = (category) => {
  const icons = {
    'Public': '🌐',
    'Authentication': '🔐',
    'Customer': '👤',
    'Admin': '⚙️',
    'Product Management': '📦',
    'User Management': '👥',
    'Other': '📄'
  };
  return icons[category] || '📄';
};

export default IndexPage;