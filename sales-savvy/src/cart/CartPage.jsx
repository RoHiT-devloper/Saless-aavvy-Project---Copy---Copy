import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    loadRazorpay();
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const fetchCartItems = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      showNotification("Please log in to view your cart", "error");
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/cart/getCart?username=${username}`);
      if (response.ok) {
        const cartData = await response.json();
        console.log("Cart Data:", cartData); // Debug log
        
        // Handle different response structures
        let items = [];
        let total = 0;
        
        if (cartData.items) {
          items = cartData.items;
          total = cartData.totalPrice || 0;
        } else if (Array.isArray(cartData)) {
          items = cartData;
          total = cartData.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 0);
        }
        
        setCartItems(items);
        setTotalPrice(total);
      } else {
        console.error('Failed to fetch cart items');
        showNotification("Failed to load cart items", "error");
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      showNotification("Error loading cart", "error");
    } finally {
      setLoading(false);
    }
  };

  // Implement handleUpdateQuantity function
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity becomes 0, remove the item instead
      await handleRemoveItem(productId);
      return;
    }
    
    const username = localStorage.getItem("username");
    if (!username) {
      showNotification("Please log in to update cart", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/cart/updateQuantity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          username: username,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        // Update local state immediately for better UX
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.product.id === productId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        
        // Recalculate total price
        const updatedTotal = cartItems.reduce((total, item) => {
          if (item.product.id === productId) {
            return total + (item.product.price * newQuantity);
          }
          return total + (item.product.price * item.quantity);
        }, 0);
        setTotalPrice(updatedTotal);
        
        showNotification("Cart updated successfully", "success");
      } else {
        showNotification("Failed to update quantity", "error");
        // Revert to original data if update fails
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification("Error updating cart", "error");
      // Revert to original data if update fails
      fetchCartItems();
    }
  };

  // Implement handleRemoveItem function
  const handleRemoveItem = async (productId) => {
    const username = localStorage.getItem("username");
    if (!username) {
      showNotification("Please log in to modify cart", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/cart/remove?productId=${productId}&username=${username}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update local state immediately for better UX
        setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
        
        // Recalculate total price
        const updatedTotal = cartItems
          .filter(item => item.product.id !== productId)
          .reduce((total, item) => total + (item.product.price * item.quantity), 0);
        setTotalPrice(updatedTotal);
        
        showNotification("Item removed from cart", "success");
      } else {
        showNotification("Failed to remove item", "error");
        // Revert to original data if removal fails
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification("Error removing item", "error");
      // Revert to original data if removal fails
      fetchCartItems();
    }
  };

  const saveOrderToDatabase = async (orderData) => {
    try {
      const response = await fetch("http://localhost:8080/api/orders/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log("Order saved successfully");
        return await response.json();
      } else {
        console.error("Failed to save order");
        return null;
      }
    } catch (error) {
      console.error("Error saving order:", error);
      return null;
    }
  };

  const generateBillData = (paymentResponse) => {
    const username = localStorage.getItem("username");
    const orderId = `ORD-${Date.now()}`;
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const taxAmount = Math.round(totalPrice * 0.18);
    const finalAmount = totalPrice > 0 ? totalPrice + 50 + taxAmount : 0;
    
    // Prepare order items for database
    const orderItems = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      itemTotal: item.product.price * item.quantity
    }));
    
    // Create order data for database
    const orderData = {
      orderId: orderId,
      username: username,
      customerName: username,
      customerEmail: `${username}@example.com`,
      orderDate: new Date().toISOString(),
      totalAmount: finalAmount,
      status: "CONFIRMED",
      shippingAddress: "123 Customer Street, City, State",
      items: orderItems
    };
    
    // Save order to database
    saveOrderToDatabase(orderData);
    
    return {
      orderId,
      date,
      time,
      customer: username,
      customerEmail: `${username}@example.com`,
      shippingAddress: "123 Customer Street, City, State",
      items: cartItems.map(item => ({
        ...item,
        itemTotal: item.product.price * item.quantity
      })),
      subtotal: totalPrice,
      tax: taxAmount,
      shipping: totalPrice > 0 ? 50 : 0,
      total: finalAmount,
      paymentId: paymentResponse.razorpay_payment_id,
      razorpayOrderId: paymentResponse.razorpay_order_id,
      signature: paymentResponse.razorpay_signature
    };
  };

  const printBill = () => {
    const printContent = document.getElementById('bill-receipt').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt for Order ${billData.orderId}</title>
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

  const initiateRazorpayPayment = async () => {
    const razorpayAvailable = await loadRazorpay();
    if (!razorpayAvailable) {
      showNotification("Payment service is temporarily unavailable. Please try again later.", "error");
      return;
    }

    setProcessingPayment(true);
    
    try {
      const taxAmount = Math.round(totalPrice * 0.18);
      const finalAmount = totalPrice > 0 ? totalPrice + 50 + taxAmount : 0;
      
      const options = {
        key: "rzp_test_1DP5mmOlF5G5ag",
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "SalesSavvy Store",
        description: "Thank you for your purchase",
        image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
        handler: function(response) {
          const billData = generateBillData(response);
          setBillData(billData);
          setShowBill(true);
          clearCartAfterPayment();
          showNotification("Payment successful! Your order has been placed.", "success");
        },
        prefill: {
          name: localStorage.getItem("username") || "Customer",
          email: "customer@example.com",
          contact: "9000090000"
        },
        notes: {
          address: "SalesSavvy Customer"
        },
        theme: {
          color: "#4285f4"
        }
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
      razorpayInstance.on('payment.failed', function(response) {
        showNotification(`Payment failed: ${response.error.description}`, "error");
        setProcessingPayment(false);
      });
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      showNotification("Something went wrong with payment processing.", "error");
      setProcessingPayment(false);
    }
  };

  const clearCartAfterPayment = async () => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      // Clear all items from cart
      const clearPromises = cartItems.map(item => 
        fetch(`http://localhost:8080/api/cart/remove?productId=${item.product.id}&username=${username}`, {
          method: "DELETE",
        })
      );
      
      await Promise.all(clearPromises);
      
      // Reset local state
      setCartItems([]);
      setTotalPrice(0);
      
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const continueShopping = () => {
    setShowBill(false);
    setBillData(null);
    navigate("/customer");
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

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (showBill && billData) {
    return (
      <div className="bill-container">
        <div className="bill-success">
          <div className="success-icon">✅</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div id="bill-receipt" className="bill-receipt">
          <div className="bill-header">
            <h1>SalesSavvy Store</h1>
            <p>123 Shopping Street, Retail City</p>
            <p>Phone: +91 9876543210 | Email: info@salesavvy.com</p>
          </div>
          
          <div className="bill-details">
            <div className="bill-row">
              <span>Order ID:</span>
              <span>{billData.orderId}</span>
            </div>
            <div className="bill-row">
              <span>Date:</span>
              <span>{billData.date}</span>
            </div>
            <div className="bill-row">
              <span>Time:</span>
              <span>{billData.time}</span>
            </div>
            <div className="bill-row">
              <span>Customer:</span>
              <span>{billData.customer}</span>
            </div>
            <div className="bill-row">
              <span>Email:</span>
              <span>{billData.customerEmail}</span>
            </div>
            <div className="bill-row">
              <span>Shipping Address:</span>
              <span>{billData.shippingAddress}</span>
            </div>
            <div className="bill-row">
              <span>Payment ID:</span>
              <span>{billData.paymentId}</span>
            </div>
          </div>
          
          <h2>Order Details</h2>
          <table className="bill-items">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {billData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>Rs.{item.product.price}</td>
                  <td>Rs.{item.product.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="bill-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>Rs.{billData.subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Tax (GST):</span>
              <span>Rs.{billData.tax}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Rs.{billData.shipping}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>Rs.{billData.total}</span>
            </div>
          </div>
          
          <div className="bill-footer">
            <p>Thank you for your purchase!</p>
            <p>Please keep this receipt for your records</p>
          </div>
        </div>
        
        <div className="bill-actions">
          <button onClick={printBill} className="print-btn">
            🖨️ Print Receipt
          </button>
          <button onClick={continueShopping} className="continue-shopping-btn">
            🛍️ Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Cart Header */}
      <div className="cart-header">
        <div className="header-content">
          <h1 className="cart-title">
            Your Shopping Cart 🛒
          </h1>
          <p className="cart-subtitle">
            Review your items and proceed to checkout
          </p>
        </div>
        <div className="cart-stats">
          <div className="stat-item">
            <span className="stat-number">{cartItems.length}</span>
            <span className="stat-label">Items</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">Rs.{totalPrice}</span>
            <span className="stat-label">Subtotal</span>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Add some amazing products to get started</p>
            <button onClick={() => navigate("/customer")} className="continue-shopping-btn">
              🛍️ Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <h2 className="section-title">Cart Items ({cartItems.length})</h2>
            <div className="cart-items">
              {cartItems.map((item) => {
                // Calculate item total safely
                const itemPrice = item.product?.price || 0;
                const itemQuantity = item.quantity || 0;
                const itemTotal = itemPrice * itemQuantity;

                return (
                  <div key={item.product?.id || item.id} className="cart-item">
                    <div className="item-badge">{item.product?.category || 'Uncategorized'}</div>
                    <div className="item-image">
                      {item.product?.photo ? (
                        <img 
                          src={item.product.photo} 
                          alt={item.product.name}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <div 
                        className="image-placeholder" 
                        style={{display: item.product?.photo ? 'none' : 'block'}}
                      >
                        📷 No Image
                      </div>
                    </div>
                    
                    <div className="item-details">
                      <h3 className="item-name">{item.product?.name || 'Unknown Product'}</h3>
                      <p className="item-description">{item.product?.description || 'No description available'}</p>
                      <p className="item-price">Rs. {itemPrice} each</p>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-section">
                        <label>Quantity:</label>
                        <div className="quantity-controls">
                          <button 
                            onClick={() => handleUpdateQuantity(item.product.id, itemQuantity - 1)}
                            disabled={itemQuantity <= 1}
                          >
                            −
                          </button>
                          <span className="quantity">{itemQuantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.product.id, itemQuantity + 1)}>
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="item-total-section">
                        <span className="item-total">Rs.{itemTotal}</span>
                        <button 
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="remove-btn"
                          title="Remove item"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="cart-summary-section">
            <div className="cart-summary">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-items">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span>Rs.{totalPrice}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (GST 18%):</span>
                  <span>Rs.{Math.round(totalPrice * 0.18)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Rs.{(totalPrice > 0 ? 50 : 0)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>Rs.{(totalPrice > 0 ? totalPrice + 50 + Math.round(totalPrice * 0.18) : 0)}</span>
                </div>
              </div>
              
              <div className="payment-info">
                <div className="security-badge">
                  <span className="lock-icon">🔒</span>
                  <span>Secure checkout powered by Razorpay</span>
                </div>
                <p className="test-mode-notice">Test Mode: Use any test card for payment</p>
              </div>
              
              <button 
                onClick={initiateRazorpayPayment} 
                disabled={processingPayment || !razorpayLoaded}
                className="checkout-btn"
              >
                {processingPayment ? (
                  <>
                    <div className="spinner-small"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    💳 Proceed to Payment - Rs.{(totalPrice > 0 ? totalPrice + 50 + Math.round(totalPrice * 0.18) : 0)}
                  </>
                )}
              </button>
              
              <button onClick={() => navigate("/customer")} className="continue-shopping-btn">
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;