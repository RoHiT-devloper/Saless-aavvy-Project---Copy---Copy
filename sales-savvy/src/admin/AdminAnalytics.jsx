// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import "./AdminAnalytics.css";

// const AdminAnalytics = () => {
//     const [analytics, setAnalytics] = useState({
//         totalRevenue: 0,
//         totalOrders: 0,
//         totalUsers: 0,
//         totalProducts: 0,
//         topProducts: [],
//         recentOrders: [],
//         recentActivities: [],
//         productSales: {} // Track sales per product
//     });
//     const [timeRange, setTimeRange] = useState('monthly');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchAnalytics();
//     }, [timeRange]);

//     const fetchAnalytics = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Fetch data from multiple endpoints
//             const [ordersRes, usersRes, productsRes] = await Promise.all([
//                 fetch('http://localhost:8080/api/orders'),
//                 fetch('http://localhost:8080/api/auth/users'),
//                 fetch('http://localhost:8080/getAllProducts')
//             ]);

//             // Check if all responses are OK
//             if (!ordersRes.ok) throw new Error('Failed to fetch orders');
//             if (!usersRes.ok) throw new Error('Failed to fetch users');
//             if (!productsRes.ok) throw new Error('Failed to fetch products');

//             const orders = await ordersRes.json();
//             const users = await usersRes.json();
//             const products = await productsRes.json();

//             // Calculate product sales from orders
//             const productSales = calculateProductSales(orders);
            
//             // Get top 5 products by sales
//             const topProducts = products
//                 .map(product => ({
//                     ...product,
//                     soldCount: productSales[product.id] || 0
//                 }))
//                 .sort((a, b) => b.soldCount - a.soldCount)
//                 .slice(0, 5);

//             const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

//             // Get recent orders (last 5)
//             const recentOrders = orders
//                 .sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0))
//                 .slice(0, 5);

//             // Generate recent activities from orders and users
//             const recentActivities = generateRecentActivities(orders, users);

//             setAnalytics({
//                 totalRevenue,
//                 totalOrders: orders.length,
//                 totalUsers: users.length,
//                 totalProducts: products.length,
//                 topProducts,
//                 recentOrders,
//                 recentActivities,
//                 productSales
//             });

//         } catch (error) {
//             console.error('Error fetching analytics:', error);
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const calculateProductSales = (orders) => {
//         const productSales = {};
        
//         orders.forEach(order => {
//             if (order.items && Array.isArray(order.items)) {
//                 order.items.forEach(item => {
//                     const productId = item.productId;
//                     const quantity = item.quantity || 1;
                    
//                     if (productId) {
//                         productSales[productId] = (productSales[productId] || 0) + quantity;
//                     }
//                 });
//             }
//         });
        
//         return productSales;
//     };

//     const generateRecentActivities = (orders, users) => {
//         const activities = [];
        
//         // Add recent orders as activities
//         orders.slice(0, 2).forEach(order => {
//             activities.push({
//                 type: 'order',
//                 text: `New order #${order.orderId || order.id} placed`,
//                 time: formatTimeAgo(order.orderDate)
//             });
//         });

//         // Add recent user registrations
//         if (users.length > 0) {
//             const recentUser = users[users.length - 1];
//             activities.push({
//                 type: 'user',
//                 text: `New user registered: ${recentUser.username}`,
//                 time: '2 hours ago'
//             });
//         }

//         // Add product activities
//         activities.push({
//             type: 'product',
//             text: 'Product inventory updated',
//             time: '4 hours ago'
//         });

//         return activities.sort(() => Math.random() - 0.5).slice(0, 4);
//     };

//     const formatTimeAgo = (dateString) => {
//         if (!dateString) return 'Recently';
        
//         const date = new Date(dateString);
//         const now = new Date();
//         const diffMs = now - date;
//         const diffMins = Math.floor(diffMs / 60000);
//         const diffHours = Math.floor(diffMs / 3600000);
//         const diffDays = Math.floor(diffMs / 86400000);

//         if (diffMins < 60) return `${diffMins} minutes ago`;
//         if (diffHours < 24) return `${diffHours} hours ago`;
//         return `${diffDays} days ago`;
//     };

//     const calculateChange = (current, previous) => {
//         if (!previous || previous === 0) return { value: 0, isPositive: true };
//         const change = ((current - previous) / previous) * 100;
//         return {
//             value: Math.abs(change).toFixed(1),
//             isPositive: change >= 0
//         };
//     };

//     // Mock previous period data for change calculation
//     const previousStats = {
//         totalRevenue: 11200,
//         totalOrders: 310,
//         totalUsers: 1200,
//         totalProducts: 52
//     };

//     if (loading) {
//         return (
//             <div className="admin-analytics-container">
//                 <div className="analytics-loading">
//                     <div className="loading-spinner"></div>
//                     <p>Loading analytics data...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="admin-analytics-container">
//                 <div className="analytics-error">
//                     <h3>Error Loading Analytics</h3>
//                     <p>{error}</p>
//                     <button onClick={fetchAnalytics} className="retry-btn">
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const revenueChange = calculateChange(analytics.totalRevenue, previousStats.totalRevenue);
//     const ordersChange = calculateChange(analytics.totalOrders, previousStats.totalOrders);
//     const usersChange = calculateChange(analytics.totalUsers, previousStats.totalUsers);
//     const productsChange = calculateChange(analytics.totalProducts, previousStats.totalProducts);

//     return (
//         <div className="admin-analytics-container admin-page">
//             <div className="admin-analytics-header">
//                 <div className="header-content">
//                     <h1 className="admin-analytics-title">Analytics Dashboard</h1>
//                     <p className="admin-analytics-subtitle">Monitor your business performance and key metrics</p>
//                 </div>
                
//                 <div className="time-range-selector">
//                     <select 
//                         value={timeRange} 
//                         onChange={(e) => setTimeRange(e.target.value)}
//                         className="range-select"
//                     >
//                         <option value="daily">Daily</option>
//                         <option value="weekly">Weekly</option>
//                         <option value="monthly">Monthly</option>
//                     </select>
//                 </div>
//             </div>
            
//             {/* Stats Overview */}
//             <div className="stats-overview">
//                 <div className="stat-card revenue-card">
//                     <div className="stat-value">₹{analytics.totalRevenue.toLocaleString()}</div>
//                     <div className="stat-label">Total Revenue</div>
//                     <div className={`stat-change ${revenueChange.isPositive ? 'positive' : 'negative'}`}>
//                         {revenueChange.isPositive ? '↑' : '↓'} {revenueChange.value}% from last period
//                     </div>
//                 </div>
                
//                 <div className="stat-card orders-card">
//                     <div className="stat-value">{analytics.totalOrders}</div>
//                     <div className="stat-label">Total Orders</div>
//                     <div className={`stat-change ${ordersChange.isPositive ? 'positive' : 'negative'}`}>
//                         {ordersChange.isPositive ? '↑' : '↓'} {ordersChange.value}% from last period
//                     </div>
//                 </div>
                
//                 <div className="stat-card users-card">
//                     <div className="stat-value">{analytics.totalUsers}</div>
//                     <div className="stat-label">Total Users</div>
//                     <div className={`stat-change ${usersChange.isPositive ? 'positive' : 'negative'}`}>
//                         {usersChange.isPositive ? '↑' : '↓'} {usersChange.value}% from last period
//                     </div>
//                 </div>
                
//                 <div className="stat-card products-card">
//                     <div className="stat-value">{analytics.totalProducts}</div>
//                     <div className="stat-label">Total Products</div>
//                     <div className={`stat-change ${productsChange.isPositive ? 'positive' : 'negative'}`}>
//                         {productsChange.isPositive ? '↑' : '↓'} {productsChange.value}% from last period
//                     </div>
//                 </div>
//             </div>
            
//             {/* Charts and Data Grid */}
//             <div className="analytics-charts-grid">
//                 {/* Top Products */}
//                 <div className="chart-card">
//                     <div className="chart-header">
//                         <h3 className="chart-title">Top Selling Products</h3>
//                         <div className="chart-actions">
//                             <Link to="/admin/products" className="chart-action-btn">View All</Link>
//                         </div>
//                     </div>
//                     <div className="chart-container">
//                         <div className="products-list">
//                             {analytics.topProducts.map((product, index) => (
//                                 <div key={product.id} className="product-rank-item">
//                                     <span className="rank-badge">#{index + 1}</span>
//                                     <div className="product-info">
//                                         <span className="product-name">{product.name}</span>
//                                         <span className="product-category">{product.category}</span>
//                                     </div>
//                                     <span className="sales-count">{product.soldCount} sold</span>
//                                 </div>
//                             ))}
//                             {analytics.topProducts.length === 0 && (
//                                 <div className="no-data">No products sold yet</div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
                
//                 {/* Recent Orders */}
//                 <div className="chart-card">
//                     <div className="chart-header">
//                         <h3 className="chart-title">Recent Orders</h3>
//                         <div className="chart-actions">
//                             <Link to="/admin/orders" className="chart-action-btn">View All</Link>
//                         </div>
//                     </div>
//                     <div className="chart-container">
//                         <div className="orders-list">
//                             {analytics.recentOrders.map(order => (
//                                 <div key={order.id} className="order-item">
//                                     <div className="order-info">
//                                         <span className="order-id">#{order.orderId || order.id}</span>
//                                         <span className="order-amount">₹{order.totalAmount || 0}</span>
//                                     </div>
//                                     <div className="order-meta">
//                                         <span className="customer">{order.customerName || order.username || 'Customer'}</span>
//                                         <span className={`status ${order.status ? order.status.toLowerCase() : 'pending'}`}>
//                                             {order.status || 'PENDING'}
//                                         </span>
//                                     </div>
//                                 </div>
//                             ))}
//                             {analytics.recentOrders.length === 0 && (
//                                 <div className="no-data">No recent orders</div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
            
//             {/* Recent Activity */}
//             <div className="recent-activity">
//                 <div className="activity-header">
//                     <h3 className="activity-title">Recent Activity</h3>
//                     <button className="chart-action-btn" onClick={fetchAnalytics}>
//                         Refresh
//                     </button>
//                 </div>
//                 <div className="activity-list">
//                     {analytics.recentActivities.map((activity, index) => (
//                         <div key={index} className="activity-item">
//                             <div className={`activity-icon ${activity.type}`}>
//                                 {activity.type === 'user' ? 'U' : activity.type === 'order' ? 'O' : 'P'}
//                             </div>
//                             <div className="activity-content">
//                                 <p className="activity-text">{activity.text}</p>
//                                 <p className="activity-time">{activity.time}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
            
//             {/* Quick Actions */}
//             <div className="quick-actions-grid">
//                 <Link to="/admin/reports" className="quick-action-card">
//                     <div className="quick-action-icon">
//                         <i className="fas fa-chart-bar"></i>
//                     </div>
//                     <h3 className="quick-action-title">Generate Reports</h3>
//                 </Link>
                
//                 <Link to="/admin/export" className="quick-action-card">
//                     <div className="quick-action-icon">
//                         <i className="fas fa-download"></i>
//                     </div>
//                     <h3 className="quick-action-title">Export Data</h3>
//                 </Link>
                
//                 <button className="quick-action-card" onClick={fetchAnalytics}>
//                     <div className="quick-action-icon">
//                         <i className="fas fa-refresh"></i>
//                     </div>
//                     <h3 className="quick-action-title">Refresh Data</h3>
//                 </button>
                
//                 <Link to="/admin/settings" className="quick-action-card">
//                     <div className="quick-action-icon">
//                         <i className="fas fa-cog"></i>
//                     </div>
//                     <h3 className="quick-action-title">Settings</h3>
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default AdminAnalytics;

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
    const [timeRange, setTimeRange] = useState('monthly');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
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
                        <option value="daily">Last 24 Hours</option>
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
                {/* Top Products */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">🔥 Top Selling Products</h3>
                        <div className="chart-actions">
                            <Link to="/admin/products" className="chart-action-btn">View All</Link>
                        </div>
                    </div>
                    <div className="chart-container">
                        <div className="products-list">
                            {analytics.topProducts && analytics.topProducts.map((product, index) => (
                                <div key={product.id} className="product-rank-item">
                                    <span className="rank-badge">#{index + 1}</span>
                                    <div className="product-info">
                                        <span className="product-name">{product.name}</span>
                                        <span className="product-category">{product.category}</span>
                                    </div>
                                    <div className="sales-info">
                                        <span className="sales-count">{product.soldCount} sold</span>
                                        <span className="product-price">₹{product.price}</span>
                                    </div>
                                </div>
                            ))}
                            {(!analytics.topProducts || analytics.topProducts.length === 0) && (
                                <div className="no-data">No products sold in this period</div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Recent Orders */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">📋 Recent Orders</h3>
                        <div className="chart-actions">
                            <Link to="/admin/orders" className="chart-action-btn">View All</Link>
                        </div>
                    </div>
                    <div className="chart-container">
                        <div className="orders-list">
                            {analytics.recentOrders && analytics.recentOrders.map(order => (
                                <div key={order.id} className="order-item">
                                    <div className="order-info">
                                        <span className="order-id">#{order.orderId || order.id}</span>
                                        <span className="order-amount">{formatCurrency(order.totalAmount || 0)}</span>
                                    </div>
                                    <div className="order-meta">
                                        <span className="customer">{order.customerName || 'Customer'}</span>
                                        <span className={`status ${order.status ? order.status.toLowerCase() : 'pending'}`}>
                                            {order.status || 'PENDING'}
                                        </span>
                                    </div>
                                    <div className="order-time">
                                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Recently'}
                                    </div>
                                </div>
                            ))}
                            {(!analytics.recentOrders || analytics.recentOrders.length === 0) && (
                                <div className="no-data">No recent orders</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Sales Chart Section */}
            <div className="chart-card full-width">
                <div className="chart-header">
                    <h3 className="chart-title">📈 Sales Trend - {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</h3>
                    <div className="chart-actions">
                        <button className="chart-action-btn">Export</button>
                    </div>
                </div>
                <div className="chart-container">
                    {analytics.salesData && analytics.salesData.data.length > 0 ? (
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
                        <div className="no-data">No sales data available for this period</div>
                    )}
                </div>
            </div>
            
            {/* Recent Activity */}
            <div className="recent-activity">
                <div className="activity-header">
                    <h3 className="activity-title">🕒 Recent Activity</h3>
                    <button className="chart-action-btn" onClick={fetchAnalytics}>
                        Refresh
                    </button>
                </div>
                <div className="activity-list">
                    {analytics.recentActivities && analytics.recentActivities.map((activity, index) => (
                        <div key={index} className="activity-item">
                            <div className={`activity-icon ${activity.type}`}>
                                {activity.type === 'user' ? '👤' : activity.type === 'order' ? '📦' : '📊'}
                            </div>
                            <div className="activity-content">
                                <p className="activity-text">{activity.text}</p>
                                <p className="activity-time">{activity.time}</p>
                            </div>
                        </div>
                    ))}
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