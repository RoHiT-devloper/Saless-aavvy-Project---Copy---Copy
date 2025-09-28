import React, { useState, useEffect } from "react";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    updateStats();
  }, [orders]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/orders");
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
        setError("");
      } else {
        setError("Failed to fetch orders. Please try again.");
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      setError("Network error. Please check if the server is running.");
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const total = orders.length;
    const pending = orders.filter(order => order.status === "PENDING").length;
    const confirmed = orders.filter(order => order.status === "CONFIRMED").length;
    const shipped = orders.filter(order => order.status === "SHIPPED").length;
    const delivered = orders.filter(order => order.status === "DELIVERED").length;
    const cancelled = orders.filter(order => order.status === "CANCELLED").length;

    setStats({ total, pending, confirmed, shipped, delivered, cancelled });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh orders list
        fetchAllOrders();
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status");
    }
  };

  const printOrderReceipt = (order) => {
    const printContent = `
      <div class="bill-receipt">
        <div class="bill-header">
          <h1>SalesSavvy Store</h1>
          <p>123 Shopping Street, Retail City</p>
          <p>Phone: +91 9876543210 | Email: info@salesavvy.com</p>
        </div>
        
        <div class="bill-details">
          <div class="bill-row">
            <span>Order ID:</span>
            <span>${order.orderId}</span>
          </div>
          <div class="bill-row">
            <span>Date:</span>
            <span>${new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
          <div class="bill-row">
            <span>Customer:</span>
            <span>${order.customerName || order.username}</span>
          </div>
          <div class="bill-row">
            <span>Email:</span>
            <span>${order.customerEmail || 'N/A'}</span>
          </div>
          <div class="bill-row">
            <span>Shipping Address:</span>
            <span>${order.shippingAddress || 'N/A'}</span>
          </div>
          <div class="bill-row">
            <span>Status:</span>
            <span>${order.status}</span>
          </div>
        </div>
        
        <h2>Order Details</h2>
        <table class="bill-items">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>Rs.${item.price}</td>
                <td>Rs.${item.price * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="bill-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>Rs.${order.totalAmount - (order.totalAmount > 0 ? 50 : 0)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>Rs.${order.totalAmount > 0 ? 50 : 0}</span>
          </div>
          <div class="summary-row total">
            <span>Total Amount:</span>
            <span>Rs.${order.totalAmount}</span>
          </div>
        </div>
        
        <div class="bill-footer">
          <p>Thank you for your purchase!</p>
          <p>Please keep this receipt for your records</p>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt for Order ${order.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .bill-receipt { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
            .bill-header { text-align: center; margin-bottom: 20px; }
            .bill-header h1 { color: #4a90e2; margin-bottom: 5px; }
            .bill-details { margin-bottom: 20px; }
            .bill-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .bill-items { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .bill-items th, .bill-items td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            .bill-items th { background-color: #f8f9fa; font-weight: 600; }
            .bill-summary { margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee; }
            .bill-summary .total { font-weight: bold; font-size: 1.2em; }
            .bill-footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; color: #666; }
            @media print {
              body { margin: 0; padding: 0; }
              .bill-receipt { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus.toUpperCase());

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'CONFIRMED': return '#3b82f6';
      case 'SHIPPED': return '#8b5cf6';
      case 'DELIVERED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="admin-orders-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      {/* Header Section */}
      <div className="orders-header">
        <div className="header-content">
          <h1 className="orders-title">
            <span className="title-icon">📦</span>
            Order Management
          </h1>
          <p className="header-subtitle">Manage customer orders and track order status</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchAllOrders} className="refresh-btn">
            <span className="btn-icon">🔄</span>
            Refresh Orders
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-icon total">📊</div>
          <div className="stat-info">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon confirmed">✅</div>
          <div className="stat-info">
            <span className="stat-number">{stats.confirmed}</span>
            <span className="stat-label">Confirmed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon shipped">🚚</div>
          <div className="stat-info">
            <span className="stat-number">{stats.shipped}</span>
            <span className="stat-label">Shipped</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon delivered">🎯</div>
          <div className="stat-info">
            <span className="stat-number">{stats.delivered}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cancelled">❌</div>
          <div className="stat-info">
            <span className="stat-number">{stats.cancelled}</span>
            <span className="stat-label">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
          <button onClick={fetchAllOrders} className="retry-btn">
            Try Again
          </button>
        </div>
      )}
      
      {/* Controls */}
      <div className="orders-controls">
        <div className="filter-section">
          <div className="filter-control">
            <label className="filter-label">
              {/* <span className="filter-icon">🔍</span> */}
              Filter by Status:
            </label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="results-count">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📭</div>
            <h3>No orders found</h3>
            <p>{filterStatus !== "all" ? `No orders with status "${filterStatus}"` : "No orders in the system"}</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="admin-order-card">
              <div className="order-header">
                <div className="order-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                  {order.status}
                </div>
                <div className="order-actions">
                  <button 
                    onClick={() => printOrderReceipt(order)} 
                    className="print-receipt-btn"
                    title="Print Receipt"
                  >
                    🖨️ Print
                  </button>
                </div>
              </div>
              
              <div className="order-content">
                <div className="order-info">
                  <div className="order-main">
                    <h3 className="order-id">Order #{order.orderId}</h3>
                    <p className="order-date">
                      <span className="info-icon">📅</span>
                      {new Date(order.orderDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="customer-details">
                    <div className="customer-info">
                      <span className="info-icon">👤</span>
                      <div>
                        <strong>{order.customerName || order.username}</strong>
                        {order.customerEmail && <div className="customer-email">{order.customerEmail}</div>}
                      </div>
                    </div>
                    
                    {order.shippingAddress && (
                      <div className="shipping-info">
                        <span className="info-icon">🏠</span>
                        <span>{order.shippingAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="order-status-control">
                  <label className="status-label">Update Status:</label>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="status-select"
                    style={{ borderColor: getStatusColor(order.status) }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="order-items-section">
                <h4 className="items-title">
                  <span className="title-icon">🛍️</span>
                  Order Items ({order.items.length})
                </h4>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <span className="item-name">{item.productName}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                      </div>
                      <div className="item-price">Rs.{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>Rs.{order.totalAmount - (order.totalAmount > 0 ? 50 : 0)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Rs.{order.totalAmount > 0 ? 50 : 0}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>Rs.{order.totalAmount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;