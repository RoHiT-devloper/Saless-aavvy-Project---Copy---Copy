import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartIcon.css";

const CartIcon = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItemCount();
    
    // Refresh cart count every 5 seconds for real-time updates
    const interval = setInterval(fetchCartItemCount, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Listen for custom events when cart is updated from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartItemCount();
    };

    // Listen for cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCartItemCount = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setCartItemCount(0);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/cart/getCart?username=${username}`);
      if (response.ok) {
        const cartData = await response.json();
        
        let count = 0;
        if (cartData.items && Array.isArray(cartData.items)) {
          count = cartData.items.length;
        } else if (Array.isArray(cartData)) {
          count = cartData.length;
        }
        
        setCartItemCount(count);
        setLastUpdate(Date.now());
      } else {
        console.error('Failed to fetch cart item count');
      }
    } catch (error) {
      console.error('Error fetching cart item count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCartClick = () => {
    // Add click animation
    const iconContainer = document.querySelector('.cart-icon-container');
    if (iconContainer) {
      iconContainer.style.transform = 'scale(0.95)';
      setTimeout(() => {
        iconContainer.style.transform = 'scale(1)';
      }, 150);
    }
    
    navigate("/cart");
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Trigger cart update from other components
  const triggerCartUpdate = () => {
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Export the function for other components to use
  useEffect(() => {
    window.triggerCartUpdate = triggerCartUpdate;
  }, []);

  const getCounterAnimation = () => {
    if (cartItemCount === 0) return '';
    return cartItemCount > 9 ? 'bounce-large' : 'bounce';
  };

  return (
    <div 
      className="cart-icon-container"
      onClick={handleCartClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={`View Cart (${cartItemCount} items)`}
    >
      <div className="cart-icon-wrapper">
        <svg 
          className={`cart-icon ${isHovered ? 'cart-icon-hover' : ''} ${isLoading ? 'cart-icon-loading' : ''}`} 
          viewBox="0 0 24 24"
        >
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        
        {isLoading ? (
          <div className="cart-loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : cartItemCount > 0 && (
          <span 
            className={`cart-count ${getCounterAnimation()} ${cartItemCount > 9 ? 'cart-count-large' : ''}`}
            key={cartItemCount} // Force re-animation when count changes
          >
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </div>
      
      {/* Tooltip on hover */}
      {isHovered && (
        <div className="cart-tooltip">
          {cartItemCount === 0 ? 'Cart is empty' : `${cartItemCount} item${cartItemCount !== 1 ? 's' : ''} in cart`}
          <br />
          <span className="tooltip-hint">Click to view</span>
        </div>
      )}
    </div>
  );
};

// Export function for other components to update the cart icon
export const updateCartIcon = () => {
  if (window.triggerCartUpdate) {
    window.triggerCartUpdate();
  }
};

export default CartIcon;