import React from 'react';
import { Link } from 'react-router-dom';
import "./Admin_Home.css";

const Admin_Home = () => {
    return (
        <div className="admin-home-container admin-page">
            <div className="admin-home-header">
                <h1 className="admin-home-title">Admin Dashboard</h1>
                <p className="admin-home-subtitle">Manage your application efficiently</p>
            </div>
            
            <div className="admin-home-content">
                <div className="admin-cards-grid">
                    <Link to="/userManagement" className="admin-card user-management-card">
                        <div className="admin-card-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <h2 className="admin-card-title">User Management</h2>
                        <p className="admin-card-description">
                            Manage user accounts, permissions, and access levels
                        </p>
                        <div className="admin-card-cta">
                            <span>Go to Users</span>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    
                    <Link to="/productmanager" className="admin-card product-management-card">
                        <div className="admin-card-icon">
                            <i className="fas fa-box"></i>
                        </div>
                        <h2 className="admin-card-title">Product Management</h2>
                        <p className="admin-card-description">
                            Manage product catalog, inventory, and pricing
                        </p>
                        <div className="admin-card-cta">
                            <span>Go to Products</span>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    
                    <Link to="/admin/orders" className="admin-card order-management-card">
                        <div className="admin-card-icon">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <h2 className="admin-card-title">Order Management</h2>
                        <p className="admin-card-description">
                            View and manage customer orders, update status, and print receipts
                        </p>
                        <div className="admin-card-cta">
                            <span>Manage Orders</span>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Admin_Home;