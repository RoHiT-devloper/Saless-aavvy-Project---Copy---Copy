import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [theme, setTheme] = React.useState('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        // Clear admin session/token
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    return (
        <>
            <nav className="admin-navbar">
                <div className="admin-nav-brand">
                    <h1>SalesSavvy</h1>
                </div>
                
                <div className="admin-nav-user">
                    <div className="user-welcome">
                        <p className="welcome-text">Welcome, Admin</p>
                        <p className="user-name">(admin)</p>
                    </div>
                </div>
                
                <div className="admin-nav-controls">
                    <button className="theme-toggle" onClick={toggleTheme}>
                        <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
            
            <div className="admin-nav-links">
                <div className="nav-links-container">
                    <Link 
                        to="/admin/dashboard" 
                        className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                    >
                        <i className="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </Link>
                    <Link 
                        to="/admin/analytics" 
                        className={`nav-link ${location.pathname === '/admin/analytics' ? 'active' : ''}`}
                    >
                        <i className="fas fa-chart-line"></i>
                        <span>Analytics</span>
                    </Link>
                    <Link 
                        to="/admin/users" 
                        className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
                    >
                        <i className="fas fa-users"></i>
                        <span>Users</span>
                    </Link>
                    <Link 
                        to="/admin/products" 
                        className={`nav-link ${location.pathname === '/admin/products' ? 'active' : ''}`}
                    >
                        <i className="fas fa-box"></i>
                        <span>Products</span>
                    </Link>
                    <Link 
                        to="/admin/orders" 
                        className={`nav-link ${location.pathname === '/admin/orders' ? 'active' : ''}`}
                    >
                        <i className="fas fa-shopping-cart"></i>
                        <span>Orders</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default AdminNavbar;