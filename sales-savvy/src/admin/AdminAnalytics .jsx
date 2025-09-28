import React, { useState, useEffect } from 'react';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        monthlyRevenue: [],
        topProducts: [],
        recentOrders: []
    });
    const [timeRange, setTimeRange] = useState('monthly');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            // In a real app, you'd have dedicated analytics endpoints
            const [ordersRes, usersRes, productsRes] = await Promise.all([
                fetch('http://localhost:8080/api/orders'),
                fetch('http://localhost:8080/api/auth/users'),
                fetch('http://localhost:8080/getAllProducts')
            ]);

            if (ordersRes.ok && usersRes.ok && productsRes.ok) {
                const orders = await ordersRes.json();
                const users = await usersRes.json();
                const products = await productsRes.json();

                // Calculate analytics
                const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
                const topProducts = products
                    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
                    .slice(0, 5);

                setAnalytics({
                    totalSales,
                    totalOrders: orders.length,
                    totalUsers: users.length,
                    totalProducts: products.length,
                    topProducts,
                    recentOrders: orders.slice(0, 5)
                });
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="analytics-loading">Loading analytics...</div>;
    }

    return (
        <div className="admin-analytics">
            <div className="analytics-header">
                <h1>Analytics Dashboard</h1>
                <div className="time-range-selector">
                    <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Rs.{analytics.totalSales.toLocaleString()}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                
                <div className="stat-card orders">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>{analytics.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>
                
                <div className="stat-card users">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{analytics.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                
                <div className="stat-card products">
                    <div className="stat-icon">🛍️</div>
                    <div className="stat-info">
                        <h3>{analytics.totalProducts}</h3>
                        <p>Total Products</p>
                    </div>
                </div>
            </div>

            <div className="analytics-content">
                <div className="top-products">
                    <h3>Top Selling Products</h3>
                    <div className="products-list">
                        {analytics.topProducts.map((product, index) => (
                            <div key={product.id} className="product-item">
                                <span className="rank">#{index + 1}</span>
                                <span className="product-name">{product.name}</span>
                                <span className="sales-count">{product.salesCount || 0} sold</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="recent-orders">
                    <h3>Recent Orders</h3>
                    <div className="orders-list">
                        {analytics.recentOrders.map(order => (
                            <div key={order.id} className="order-item">
                                <div className="order-info">
                                    <span className="order-id">#{order.orderId}</span>
                                    <span className="order-amount">Rs.{order.totalAmount}</span>
                                </div>
                                <div className="order-meta">
                                    <span className="customer">{order.customerName}</span>
                                    <span className={`status ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;