import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

// Import the AddressManager component
const AddressManager = ({ onAddressSelect, showSelector = false }) => {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        addressType: 'HOME',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        const username = localStorage.getItem('username');
        if (!username) return;

        try {
            const response = await fetch(`http://localhost:8080/api/addresses/user/${username}`);
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = localStorage.getItem('username');
        
        try {
            const addressData = {
                ...formData,
                username
            };

            const url = editingAddress ? 
                `http://localhost:8080/api/addresses/${editingAddress.id}` :
                'http://localhost:8080/api/addresses/add';
            
            const method = editingAddress ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });

            if (response.ok) {
                setShowForm(false);
                setEditingAddress(null);
                setFormData({
                    fullName: '',
                    phoneNumber: '',
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    addressType: 'HOME',
                    isDefault: false
                });
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    const setDefaultAddress = async (addressId) => {
        const username = localStorage.getItem('username');
        try {
            const response = await fetch(
                `http://localhost:8080/api/addresses/${addressId}/set-default?username=${username}`,
                { method: 'POST' }
            );
            if (response.ok) {
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error setting default address:', error);
        }
    };

    const deleteAddress = async (addressId) => {
        const username = localStorage.getItem('username');
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/addresses/${addressId}?username=${username}`,
                    { method: 'DELETE' }
                );
                if (response.ok) {
                    fetchAddresses();
                }
            } catch (error) {
                console.error('Error deleting address:', error);
            }
        }
    };

    const editAddress = (address) => {
        setEditingAddress(address);
        setFormData({
            fullName: address.fullName,
            phoneNumber: address.phoneNumber,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            addressType: address.addressType,
            isDefault: address.isDefault
        });
        setShowForm(true);
    };

    return (
        <div className="address-manager">
            <div className="address-header">
                <h3>Shipping Addresses</h3>
                <button 
                    onClick={() => {
                        setEditingAddress(null);
                        setShowForm(true);
                        setFormData({
                            fullName: '',
                            phoneNumber: '',
                            street: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            addressType: 'HOME',
                            isDefault: false
                        });
                    }}
                    className="add-address-btn"
                >
                    + Add New Address
                </button>
            </div>

            {showForm && (
                <form className="address-form" onSubmit={handleSubmit}>
                    <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                    
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            required
                        />
                    </div>

                    <textarea
                        placeholder="Street Address"
                        value={formData.street}
                        onChange={(e) => setFormData({...formData, street: e.target.value})}
                        required
                    />

                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="ZIP Code"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <select
                            value={formData.addressType}
                            onChange={(e) => setFormData({...formData, addressType: e.target.value})}
                        >
                            <option value="HOME">Home</option>
                            <option value="WORK">Work</option>
                            <option value="OTHER">Other</option>
                        </select>
                        
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                            />
                            Set as default address
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn">
                            {editingAddress ? 'Update Address' : 'Save Address'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setShowForm(false)}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="addresses-list">
                {addresses.map(address => (
                    <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                        <div className="address-content">
                            <div className="address-type">{address.addressType}</div>
                            {address.isDefault && <span className="default-badge">Default</span>}
                            <p><strong>{address.fullName}</strong> | {address.phoneNumber}</p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                            <p>{address.country}</p>
                        </div>
                        <div className="address-actions">
                            {!address.isDefault && (
                                <button 
                                    onClick={() => setDefaultAddress(address.id)}
                                    className="set-default-btn"
                                >
                                    Set Default
                                </button>
                            )}
                            <button 
                                onClick={() => editAddress(address)}
                                className="edit-btn"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => deleteAddress(address.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                            {showSelector && onAddressSelect && (
                                <button 
                                    onClick={() => onAddressSelect(address)}
                                    className="select-btn"
                                >
                                    Select
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState(null);
  
  // New state variables for enhanced features
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    loadRazorpay();
    fetchWishlistItems();
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
        console.log("Cart Data:", cartData);
        
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

  const fetchWishlistItems = async () => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      const response = await fetch(`http://localhost:8080/api/wishlist/${username}`);
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemoveItem(productId);
      return;
    }
    
    const username = localStorage.getItem("username");
    if (!username) {
      showNotification("Please log in to update cart", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/cart/update", {
        method: "POST",
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
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.product.id === productId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        
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
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification("Error updating cart", "error");
      fetchCartItems();
    }
  };

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
        setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
        
        const updatedTotal = cartItems
          .filter(item => item.product.id !== productId)
          .reduce((total, item) => total + (item.product.price * item.quantity), 0);
        setTotalPrice(updatedTotal);
        
        showNotification("Item removed from cart", "success");
      } else {
        showNotification("Failed to remove item", "error");
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification("Error removing item", "error");
      fetchCartItems();
    }
  };

  const addToWishlist = async (product) => {
    const username = localStorage.getItem("username");
    if (!username) {
      showNotification("Please log in to add to wishlist", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/wishlist/add?username=${username}&productId=${product.id}`, {
        method: "POST",
      });

      if (response.ok) {
        showNotification(`Added ${product.name} to wishlist!`, "success");
        fetchWishlistItems();
      } else {
        showNotification("Failed to add to wishlist", "error");
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showNotification("Error adding to wishlist", "error");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/coupons/validate?code=${couponCode}&orderAmount=${totalPrice}`
      );
      
      if (response.ok) {
        const discount = await response.json();
        setAppliedCoupon(discount);
        setCouponError('');
        showNotification("Coupon applied successfully!", "success");
      } else {
        const error = await response.json();
        setCouponError(error.error);
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError('Error applying coupon');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    let discount = 0;
    const subtotal = totalPrice;
    const taxAmount = Math.round(subtotal * 0.18);
    const shipping = subtotal > 0 ? 50 : 0;
    const totalBeforeDiscount = subtotal + taxAmount + shipping;

    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discount = (totalBeforeDiscount * appliedCoupon.discountValue) / 100;
    } else {
      discount = appliedCoupon.discountValue;
    }

    return Math.min(discount, totalBeforeDiscount);
  };

  const calculateFinalTotal = () => {
    const subtotal = totalPrice;
    const taxAmount = Math.round(subtotal * 0.18);
    const shipping = subtotal > 0 ? 50 : 0;
    const discount = calculateDiscount();
    
    return Math.max(0, subtotal + taxAmount + shipping - discount);
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
    const subtotal = totalPrice;
    const taxAmount = Math.round(subtotal * 0.18);
    const shipping = subtotal > 0 ? 50 : 0;
    const discount = calculateDiscount();
    const finalAmount = calculateFinalTotal();
    
    const orderItems = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      itemTotal: item.product.price * item.quantity
    }));
    
    const orderData = {
      orderId: orderId,
      username: username,
      customerName: username,
      customerEmail: `${username}@example.com`,
      orderDate: new Date().toISOString(),
      totalAmount: finalAmount,
      status: "CONFIRMED",
      shippingAddress: selectedAddress ? 
        `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}` : 
        "Address not specified",
      items: orderItems,
      couponCode: appliedCoupon ? couponCode : null,
      discountAmount: discount
    };
    
    saveOrderToDatabase(orderData);
    
    return {
      orderId,
      date,
      time,
      customer: username,
      customerEmail: `${username}@example.com`,
      shippingAddress: selectedAddress ? 
        `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}` : 
        "Address not specified",
      items: cartItems.map(item => ({
        ...item,
        itemTotal: item.product.price * item.quantity
      })),
      subtotal: subtotal,
      tax: taxAmount,
      shipping: shipping,
      discount: discount,
      total: finalAmount,
      couponCode: appliedCoupon ? couponCode : null,
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
            .discount { color: #28a745; }
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
    if (!selectedAddress) {
      showNotification("Please select a shipping address", "error");
      return;
    }

    const razorpayAvailable = await loadRazorpay();
    if (!razorpayAvailable) {
      showNotification("Payment service is temporarily unavailable. Please try again later.", "error");
      return;
    }

    setProcessingPayment(true);
    
    try {
      const finalAmount = calculateFinalTotal();
      
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
      const clearPromises = cartItems.map(item => 
        fetch(`http://localhost:8080/api/cart/remove?productId=${item.product.id}&username=${username}`, {
          method: "DELETE",
        })
      );
      
      await Promise.all(clearPromises);
      
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

  const showNotification = (message, type = 'info') => {
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
            {billData.couponCode && (
              <div className="bill-row">
                <span>Coupon Applied:</span>
                <span>{billData.couponCode}</span>
              </div>
            )}
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
              <span>Tax (GST 18%):</span>
              <span>Rs.{billData.tax}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Rs.{billData.shipping}</span>
            </div>
            {billData.discount > 0 && (
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>-Rs.{billData.discount}</span>
              </div>
            )}
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

  const subtotal = totalPrice;
  const taxAmount = Math.round(subtotal * 0.18);
  const shipping = subtotal > 0 ? 50 : 0;
  const discount = calculateDiscount();
  const finalTotal = calculateFinalTotal();

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
            <span className="stat-number">Rs.{subtotal}</span>
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
                const itemPrice = item.product?.price || 0;
                const itemQuantity = item.quantity || 0;
                const itemTotal = itemPrice * itemQuantity;
                const inWishlist = isInWishlist(item.product.id);

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
                      
                      <div className="item-actions">
                        <button 
                          onClick={() => addToWishlist(item.product)}
                          disabled={inWishlist}
                          className={`wishlist-btn ${inWishlist ? 'in-wishlist' : ''}`}
                        >
                          {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                        </button>
                      </div>
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
              
              {/* Coupon Section */}
              <div className="coupon-section">
                <h4>Apply Coupon</h4>
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="coupon-input"
                  />
                  {appliedCoupon ? (
                    <button 
                      onClick={removeCoupon}
                      className="remove-coupon-btn"
                    >
                      Remove
                    </button>
                  ) : (
                    <button 
                      onClick={applyCoupon}
                      className="apply-coupon-btn"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponError && <div className="coupon-error">{couponError}</div>}
                {appliedCoupon && (
                  <div className="coupon-success">
                    Coupon applied! Discount: Rs.{discount}
                  </div>
                )}
              </div>

              {/* Shipping Address Section */}
              <div className="shipping-section">
                <h4>Shipping Address</h4>
                {selectedAddress ? (
                  <div className="selected-address">
                    <p><strong>{selectedAddress.fullName}</strong></p>
                    <p>{selectedAddress.street}, {selectedAddress.city}</p>
                    <p>{selectedAddress.state} - {selectedAddress.zipCode}</p>
                    <button 
                      onClick={() => setShowAddressManager(true)}
                      className="change-address-btn"
                    >
                      Change Address
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowAddressManager(true)}
                    className="select-address-btn"
                  >
                    Select Shipping Address
                  </button>
                )}
              </div>

              {/* Order Summary */}
              <div className="summary-items">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span>Rs.{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (GST 18%):</span>
                  <span>Rs.{taxAmount}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Rs.{shipping}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount:</span>
                    <span>-Rs.{discount}</span>
                  </div>
                )}
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>Rs.{finalTotal}</span>
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
                disabled={processingPayment || !razorpayLoaded || !selectedAddress}
                className="checkout-btn"
              >
                {processingPayment ? (
                  <>
                    <div className="spinner-small"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    💳 Proceed to Payment - Rs.{finalTotal}
                  </>
                )}
              </button>
              
              {!selectedAddress && (
                <p className="address-warning">Please select a shipping address to proceed</p>
              )}
              
              <button onClick={() => navigate("/customer")} className="continue-shopping-btn">
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Manager Modal */}
      {showAddressManager && (
        <div className="address-modal-overlay">
          <div className="address-modal">
            <div className="modal-header">
              <h3>Select Shipping Address</h3>
              <button 
                onClick={() => setShowAddressManager(false)}
                className="close-modal-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <AddressManager 
                onAddressSelect={(address) => {
                  setSelectedAddress(address);
                  setShowAddressManager(false);
                }}
                showSelector={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;