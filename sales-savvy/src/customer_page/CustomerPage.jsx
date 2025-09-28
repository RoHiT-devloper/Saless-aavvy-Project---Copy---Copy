import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CustomerPage.css";
import CartIcon from "../cart/CartIcon";

const CustomerPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderHistoryLoading, setOrderHistoryLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Check theme preference on component mount
  useEffect(() => {
    const darkTheme = localStorage.getItem('darkTheme') === 'true';
    setIsDarkTheme(darkTheme);
    document.body.className = darkTheme ? 'dark-theme' : 'light-theme';
  }, []);

  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
    } else {
      fetchProductsFromAPI();
    }
    
    fetchCartItems();
  }, [location.state]);

  const fetchProductsFromAPI = async () => {
    try {
      const response = await fetch('http://localhost:8080/getAllProducts');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    const username = localStorage.getItem("username");
    if (!username) return;
    
    setOrderHistoryLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/orders/user/${username}`);
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      } else {
        console.error('Failed to fetch order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setOrderHistoryLoading(false);
    }
  };

  const fetchCartItems = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/cart/getCart?username=${username}`);
      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData.items || []);
        
        const initialQuantities = {};
        products.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const changeQuantity = (productId, change) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(currentQty + change, 1);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleAddToCart = async (product) => {
    const username = localStorage.getItem("username");
    const qty = quantities[product.id] || 1;

    if (!username) {
      alert("Please log in to add products to your cart.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/addToCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          username: username,
          quantity: qty,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      } else {
        // Show success notification instead of alert
        showNotification(`Added ${product.name} (x${qty}) to cart!`, 'success');
        
        setQuantities(prev => ({
          ...prev,
          [product.id]: 1
        }));
        
        fetchCartItems();
      }
    } catch (error) {
      console.error(error);
      showNotification('Failed to add product to cart!', 'error');
    }
  };

  // Notification system
  const showNotification = (message, type = 'info') => {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  };

  const getCartQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.product && item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const toggleOrderHistory = () => {
    if (!showOrderHistory) {
      fetchOrderHistory();
    }
    setShowOrderHistory(!showOrderHistory);
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
            <span>${formatDate(order.orderDate)}</span>
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="customer-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-container">
      <CartIcon />
      
      {/* Welcome Header with User Info */}
      <div className="welcome-header">
        <div className="welcome-content">
          <h1 className="customer-title">
            Welcome back, <span className="username-highlight">{localStorage.getItem("username") || "Customer"}!</span>
          </h1>
          <p className="welcome-subtitle">Discover amazing products tailored for you</p>
        </div>
        <div className="welcome-stats">
          <div className="stat-card">
            <span className="stat-number">{products.length}</span>
            <span className="stat-label">Total Products</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{cartItems.length}</span>
            <span className="stat-label">Cart Items</span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="customer-tabs">
        <button 
          className={!showOrderHistory ? "tab-active" : "tab-inactive"}
          onClick={() => setShowOrderHistory(false)}
        >
          <span className="tab-icon">🛍️</span>
          Products
        </button>
        <button 
          className={showOrderHistory ? "tab-active" : "tab-inactive"}
          onClick={toggleOrderHistory}
        >
          <span className="tab-icon">📋</span>
          Order History
        </button>
      </div>

      {showOrderHistory ? (
        <div className="order-history-section">
          <div className="section-header">
            <h2>Your Order History</h2>
            <p>Track and manage your past purchases</p>
          </div>
          
          {orderHistoryLoading ? (
            <div className="loading-orders">
              <div className="spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <div className="empty-state">
                <span className="empty-icon">📦</span>
                <h3>No orders yet</h3>
                <p>Start shopping to see your order history here</p>
                <button onClick={() => setShowOrderHistory(false)} className="shop-now-btn">
                  Start Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.orderId}</h3>
                      <p className="order-date">{formatDate(order.orderDate)}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                      <button 
                        onClick={() => printOrderReceipt(order)} 
                        className="print-receipt-btn"
                        title="Print Receipt"
                      >
                        🖨️ Print Receipt
                      </button>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.productName}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                        <span className="item-price">Rs.{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-footer">
                    <div className="order-total">
                      Total: <span>Rs.{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="customer-search"
              />
            </div>

            <div className="filter-container">
              <span className="filter-icon">📂</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="customer-category"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <p>
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="empty-products">
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
                {(searchTerm || selectedCategory !== "all") && (
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }} 
                    className="clear-filters-btn"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
<div className="customer-products-grid">
  {filteredProducts.map((product) => {
    const qty = quantities[product.id] || 1;
    const total = qty * product.price;
    const cartQty = getCartQuantity(product.id);

    return (
      <div key={product.id} className="customer-card">
        {/* Product Image Section */}
        <div className="product-image-section">
          <div className="customer-image">
            {product.photo ? (
              <img
                src={product.photo}
                alt={product.name}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
            ) : null}
            <div 
              className="image-placeholder"
              style={{display: product.photo ? 'none' : 'flex'}}
            >
              📷
            </div>
          </div>
          <div className="product-badge">{product.category}</div>
        </div>

        {/* Product Details Section */}
        <div className="product-details-section">
          <div className="product-header">
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
            </div>
            <div className="product-price">
              <span className="price">Rs.{product.price}</span>
              <span className="price-unit">per unit</span>
            </div>
          </div>

          {/* Product Controls Section */}
          <div className="product-controls-section">
            <div className="quantity-section">
              <span className="quantity-label">Quantity:</span>
              <div className="customer-quantity">
                <button 
                  onClick={() => changeQuantity(product.id, -1)}
                  disabled={qty <= 1}
                >
                  −
                </button>
                <span>{qty}</span>
                <button onClick={() => changeQuantity(product.id, 1)}>
                  +
                </button>
              </div>
            </div>

            <div className="cart-status">
              <div className="cart-indicator">
                {cartQty > 0 && (
                  <span className="cart-badge">In Cart: {cartQty}</span>
                )}
                <div className="total-price">
                  <span className="total-label">Total:</span>
                  <span className="total-amount">Rs.{total}</span>
                </div>
              </div>
              <button
                className={`customer-add-to-cart ${cartQty > 0 ? 'in-cart' : ''}`}
                onClick={() => handleAddToCart(product)}
              >
                {cartQty > 0 ? 'Update Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerPage;