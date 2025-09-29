import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./AdminAnalytics.css";

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        revenueChange: 0,
        ordersChange: 0,
        usersChange: 0,
        productsChange: 0,
        topProducts: [],
        recentOrders: [],
        recentActivities: [],
        salesData: { data: [], labels: [] },
        customerStats: {}
    });
    const [timeRange, setTimeRange] = useState('daily');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshingOrders, setRefreshingOrders] = useState(false);
    const [refreshingActivities, setRefreshingActivities] = useState(false);

    useEffect(() => {
        fetchAnalytics();
        // Set up real-time updates every 30 seconds
        const interval = setInterval(fetchAnalytics, 30000);
        return () => clearInterval(interval);
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:8080/api/analytics/dashboard?timeRange=${timeRange}`);
            if (!response.ok) throw new Error('Failed to fetch analytics');
            const data = await response.json();

            setAnalytics(data);

        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            setRefreshingOrders(true);
            const response = await fetch('http://localhost:8080/api/orders/recent');
            if (!response.ok) throw new Error('Failed to fetch recent orders');
            const orders = await response.json();
            
            setAnalytics(prev => ({
                ...prev,
                recentOrders: orders
            }));
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        } finally {
            setRefreshingOrders(false);
        }
    };

    // If you have an AdminAnalytics component, update time calculations
const calculateTimeAgo = (dateTime) => {
    if (!dateTime) {
        return "Recently";
    }
    
    try {
        const now = new Date();
        const activityTime = new Date(dateTime);
        
        // Convert both to IST
        const nowIST = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        const activityTimeIST = new Date(activityTime.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        
        const diffMs = nowIST - activityTimeIST;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffSeconds < 60) {
            return "Just now";
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return activityTimeIST.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'Asia/Kolkata'
            });
        }
    } catch (error) {
        return "Recently";
    }
};

    const fetchRecentActivities = async () => {
        try {
            setRefreshingActivities(true);
            const response = await fetch('http://localhost:8080/api/analytics/recent-activities');
            if (!response.ok) throw new Error('Failed to fetch recent activities');
            const activities = await response.json();
            
            setAnalytics(prev => ({
                ...prev,
                recentActivities: activities
            }));
        } catch (error) {
            console.error('Error fetching recent activities:', error);
        } finally {
            setRefreshingActivities(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffHours < 24) {
            return date.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    const getStatusColor = (status) => {
        if (!status) return 'pending';
        
        switch (status.toLowerCase()) {
            case 'delivered': return 'delivered';
            case 'shipped': return 'shipped';
            case 'processing': return 'processing';
            case 'confirmed': return 'confirmed';
            case 'cancelled': return 'cancelled';
            default: return 'pending';
        }
    };

    const isToday = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const getActivityTypeCount = (type) => {
        if (!analytics.recentActivities) return 0;
        return analytics.recentActivities.filter(activity => activity.type === type).length;
    };

    const getTimeRangeLabel = () => {
        switch (timeRange) {
            case 'daily': return 'Today';
            case 'weekly': return 'Last 7 Days';
            case 'monthly': return 'Last 30 Days';
            default: return 'Today';
        }
    };

    if (loading) {
        return (
            <div className="admin-analytics-container">
                <div className="analytics-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading real-time analytics data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-analytics-container">
                <div className="analytics-error">
                    <h3>Error Loading Analytics</h3>
                    <p>{error}</p>
                    <button onClick={fetchAnalytics} className="retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-analytics-container admin-page">
            <div className="admin-analytics-header">
                <div className="header-content">
                    <h1 className="admin-analytics-title">Real-Time Analytics Dashboard</h1>
                    <p className="admin-analytics-subtitle">Live business performance and metrics</p>
                </div>
                
                <div className="time-range-selector">
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="range-select"
                    >
                        <option value="daily">Today</option>
                        <option value="weekly">Last 7 Days</option>
                        <option value="monthly">Last 30 Days</option>
                    </select>
                    <button className="refresh-btn" onClick={fetchAnalytics} title="Refresh Data">
                        <i className="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
            
            {/* Stats Overview */}
            <div className="stats-overview">
                <div className="stat-card revenue-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <div className="stat-value">{formatCurrency(analytics.totalRevenue)}</div>
                        <div className="stat-label">Total Revenue</div>
                        <div className={`stat-change ${analytics.revenueChange >= 0 ? 'positive' : 'negative'}`}>
                            {analytics.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(analytics.revenueChange).toFixed(1)}% from last period
                        </div>
                    </div>
                </div>
                
                <div className="stat-card orders-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <div className="stat-value">{analytics.totalOrders}</div>
                        <div className="stat-label">Total Orders</div>
                        <div className={`stat-change ${analytics.ordersChange >= 0 ? 'positive' : 'negative'}`}>
                            {analytics.ordersChange >= 0 ? '↑' : '↓'} {Math.abs(analytics.ordersChange).toFixed(1)}% from last period
                        </div>
                    </div>
                </div>
                
                <div className="stat-card users-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <div className="stat-value">{analytics.totalUsers}</div>
                        <div className="stat-label">Total Users</div>
                        <div className={`stat-change ${analytics.usersChange >= 0 ? 'positive' : 'negative'}`}>
                            {analytics.usersChange >= 0 ? '↑' : '↓'} {Math.abs(analytics.usersChange).toFixed(1)}% from last period
                        </div>
                    </div>
                </div>
                
                <div className="stat-card products-card">
                    <div className="stat-icon">🛍️</div>
                    <div className="stat-info">
                        <div className="stat-value">{analytics.totalProducts}</div>
                        <div className="stat-label">Total Products</div>
                        <div className={`stat-change ${analytics.productsChange >= 0 ? 'positive' : 'negative'}`}>
                            {analytics.productsChange >= 0 ? '↑' : '↓'} {Math.abs(analytics.productsChange).toFixed(1)}% from last period
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Charts and Data Grid */}
            <div className="analytics-charts-grid">
                {/* Top Products - Scrollable */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">🔥 Top Selling Products</h3>
                        <div className="chart-actions">
                            <Link to="/admin/products" className="chart-action-btn">View All</Link>
                        </div>
                    </div>
                    <div className="products-container">
                        <div className="products-list scrollable">
                            {analytics.topProducts && analytics.topProducts.length > 0 ? (
                                analytics.topProducts.map((product, index) => (
                                    <div key={product.id || index} className="product-rank-item">
                                        <span className="rank-badge">#{index + 1}</span>
                                        <div className="product-info">
                                            <span className="product-name">{product.name || 'Unknown Product'}</span>
                                            <span className="product-category">{product.category || 'Uncategorized'}</span>
                                        </div>
                                        <div className="sales-info">
                                            <span className="sales-count">{product.soldCount || 0} sold</span>
                                            <span className="product-price">₹{product.price || 0}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">No products sold in this period</div>
                            )}
                        </div>
                        
                        {/* Products Summary */}
                        {analytics.topProducts && analytics.topProducts.length > 0 && (
                            <div className="products-summary">
                                <div className="summary-stats">
                                    <div className="stat">
                                        <span className="stat-label">Total Sold:</span>
                                        <span className="stat-value">
                                            {analytics.topProducts.reduce((sum, product) => sum + (product.soldCount || 0), 0)}
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Top Product:</span>
                                        <span className="stat-value">
                                            {analytics.topProducts[0]?.name?.substring(0, 15) || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Avg Price:</span>
                                        <span className="stat-value">
                                            {formatCurrency(
                                                analytics.topProducts.reduce((sum, product) => sum + (product.price || 0), 0) / 
                                                analytics.topProducts.length
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Recent Orders - Scrollable Container */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">
                            📋 Recent Orders 
                            {analytics.recentOrders && analytics.recentOrders.length > 0 && (
                                <span className="orders-count">{analytics.recentOrders.length}</span>
                            )}
                        </h3>
                        <div className="chart-actions">
                            <button 
                                onClick={fetchRecentOrders} 
                                className={`chart-action-btn ${refreshingOrders ? 'loading' : ''}`}
                                disabled={refreshingOrders}
                            >
                                {refreshingOrders ? 'Refreshing...' : 'Refresh'}
                            </button>
                            <Link to="/admin/orders" className="chart-action-btn">View All</Link>
                        </div>
                    </div>
                    
                    <div className="orders-container">
                        <div className="orders-container-header">
                            <div className="order-column order-id-header">Order ID</div>
                            <div className="order-column customer-header">Customer</div>
                            <div className="order-column status-header">Status</div>
                            <div className="order-column amount-header">Amount</div>
                            <div className="order-column time-header">Time</div>
                        </div>
                        
                        <div className={`orders-list scrollable ${refreshingOrders ? 'loading' : ''}`}>
                            {analytics.recentOrders && analytics.recentOrders.length > 0 ? (
                                analytics.recentOrders.map(order => {
                                    const orderId = order.orderId || order.id;
                                    const isTodayOrder = order.orderDate && isToday(order.orderDate);
                                    
                                    return (
                                        <div 
                                            key={order.id} 
                                            className={`order-item ${isTodayOrder ? 'today' : ''}`}
                                        >
                                            <div className="order-column order-id">
                                                <span className="order-id-text">#{orderId}</span>
                                                <span className="order-message-count">
                                                    💬{order.messageCount || 0}
                                                </span>
                                            </div>
                                            
                                            <div className="order-column customer">
                                                <span className="customer-name">
                                                    {order.customerName || order.username || order.email || 'Customer'}
                                                </span>
                                                {order.items && order.items.length > 0 && (
                                                    <span className="order-items-count">
                                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="order-column status">
                                                <span className={`status-badge ${getStatusColor(order.status)}`}>
                                                    {order.status || 'PENDING'}
                                                </span>
                                            </div>
                                            
                                            <div className="order-column amount">
                                                <span className="order-amount">
                                                    {formatCurrency(order.totalAmount || order.amount || 0)}
                                                </span>
                                            </div>
                                            
                                            <div className="order-column time">
                                                <div className="order-time">
                                                    {formatDate(order.orderDate || order.createdAt)}
                                                    {isTodayOrder && <span className="real-time-indicator"></span>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-orders">
                                    <div className="no-orders-icon">📦</div>
                                    <p className="no-orders-text">No recent orders found</p>
                                    <p className="no-orders-subtext">New orders will appear here as they come in</p>
                                    <button onClick={fetchRecentOrders} className="chart-action-btn">
                                        Load Orders
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Orders Summary */}
                        {analytics.recentOrders && analytics.recentOrders.length > 0 && (
                            <div className="orders-summary">
                                <div className="summary-stats">
                                    <div className="stat">
                                        <span className="stat-label">Total Value:</span>
                                        <span className="stat-value">
                                            {formatCurrency(analytics.recentOrders.reduce((sum, order) => sum + (order.totalAmount || order.amount || 0), 0))}
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Today's Orders:</span>
                                        <span className="stat-value">
                                            {analytics.recentOrders.filter(order => order.orderDate && isToday(order.orderDate)).length}
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Avg. Order:</span>
                                        <span className="stat-value">
                                            {formatCurrency(
                                                analytics.recentOrders.reduce((sum, order) => sum + (order.totalAmount || order.amount || 0), 0) / 
                                                analytics.recentOrders.length
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Sales Chart Section */}
            <div className="chart-card full-width">
                <div className="chart-header">
                    <h3 className="chart-title">📈 Sales Trend - {getTimeRangeLabel()}</h3>
                    <div className="chart-actions">
                        <button className="chart-action-btn">Export</button>
                    </div>
                </div>
                <div className="chart-container">
                    {analytics.salesData && analytics.salesData.data && analytics.salesData.data.length > 0 ? (
                        <div className="sales-chart">
                            <div className="chart-bars">
                                {analytics.salesData.data.map((value, index) => (
                                    <div key={index} className="chart-bar-container">
                                        <div 
                                            className="chart-bar" 
                                            style={{ height: `${Math.max((value / Math.max(...analytics.salesData.data)) * 100, 5)}%` }}
                                            title={`${analytics.salesData.labels[index]}: ${formatCurrency(value)}`}
                                        ></div>
                                        <span className="chart-label">{analytics.salesData.labels[index]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="no-data">No sales data available for {getTimeRangeLabel().toLowerCase()}</div>
                    )}
                </div>
            </div>
            
            {/* Recent Activity */}
            <div className="recent-activity">
                <div className="activity-header">
                    <h3 className="activity-title">🕒 Recent Activity</h3>
                    <div className="activity-actions">
                        <button 
                            className={`chart-action-btn ${refreshingActivities ? 'loading' : ''}`}
                            onClick={fetchRecentActivities}
                            disabled={refreshingActivities}
                        >
                            {refreshingActivities ? 'Refreshing...' : 'Refresh'}
                        </button>
                        {analytics.recentActivities && analytics.recentActivities.length > 0 && (
                            <span className="activity-count">
                                {analytics.recentActivities.length} activities
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="activity-container">
                    <div className="activity-list scrollable">
                        {analytics.recentActivities && analytics.recentActivities.length > 0 ? (
                            analytics.recentActivities.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className={`activity-icon ${activity.type || 'analytics'}`}>
                                        {activity.type === 'user' ? '👤' : 
                                         activity.type === 'order' ? '📦' : 
                                         activity.type === 'product' ? '🛍️' : '📊'}
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-text">{activity.text || activity.message || 'Activity updated'}</p>
                                        <div className="activity-meta">
                                            <span className="activity-time">
                                                {formatDate(activity.timestamp || activity.createdAt)}
                                            </span>
                                            {activity.status && (
                                                <span className={`activity-status ${activity.status}`}>
                                                    {activity.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-activity">
                                <div className="no-activity-icon">📊</div>
                                <p className="no-activity-text">No recent activity</p>
                                <p className="no-activity-subtext">Activities will appear here as they happen</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Activity Summary */}
                    {analytics.recentActivities && analytics.recentActivities.length > 0 && (
                        <div className="activity-summary">
                            <div className="summary-item">
                                <span className="summary-label">Users</span>
                                <span className="summary-count">
                                    {getActivityTypeCount('user')}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Orders</span>
                                <span className="summary-count">
                                    {getActivityTypeCount('order')}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Products</span>
                                <span className="summary-count">
                                    {getActivityTypeCount('product')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Quick Actions */}
            <div className="quick-actions-grid">
                <Link to="/admin/reports" className="quick-action-card">
                    <div className="quick-action-icon">
                        <i className="fas fa-chart-bar"></i>
                    </div>
                    <h3 className="quick-action-title">Generate Reports</h3>
                </Link>
                
                <Link to="/admin/export" className="quick-action-card">
                    <div className="quick-action-icon">
                        <i className="fas fa-download"></i>
                    </div>
                    <h3 className="quick-action-title">Export Data</h3>
                </Link>
                
                <button className="quick-action-card" onClick={fetchAnalytics}>
                    <div className="quick-action-icon">
                        <i className="fas fa-refresh"></i>
                    </div>
                    <h3 className="quick-action-title">Refresh Data</h3>
                </button>
                
                <Link to="/admin/settings" className="quick-action-card">
                    <div className="quick-action-icon">
                        <i className="fas fa-cog"></i>
                    </div>
                    <h3 className="quick-action-title">Settings</h3>
                </Link>
            </div>
        </div>
    );
};

export default AdminAnalytics;