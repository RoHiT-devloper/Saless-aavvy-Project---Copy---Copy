import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({}); // Store quantities separately
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const username = localStorage.getItem('username');
        if (!username) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/wishlist/${username}`);
            if (response.ok) {
                const products = await response.json();
                setWishlistItems(products);
                
                // Fetch quantities for each product
                const quantityPromises = products.map(product => 
                    fetch(`http://localhost:8080/api/wishlist/quantity?username=${username}&productId=${product.id}`)
                        .then(res => res.json())
                        .then(data => ({ productId: product.id, quantity: data.quantity }))
                );
                
                const quantityResults = await Promise.all(quantityPromises);
                const quantityMap = {};
                quantityResults.forEach(result => {
                    quantityMap[result.productId] = result.quantity;
                });
                setQuantities(quantityMap);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        const username = localStorage.getItem('username');
        try {
            const response = await fetch(
                `http://localhost:8080/api/wishlist/update-quantity?username=${username}&productId=${productId}&quantity=${newQuantity}`,
                { method: 'PUT' }
            );

            if (response.ok) {
                // Update local state
                setQuantities(prev => ({
                    ...prev,
                    [productId]: newQuantity
                }));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeFromWishlist = async (productId) => {
        const username = localStorage.getItem('username');
        try {
            const response = await fetch(
                `http://localhost:8080/api/wishlist/remove?username=${username}&productId=${productId}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                setWishlistItems(wishlistItems.filter(item => item.id !== productId));
                // Remove from quantities state
                setQuantities(prev => {
                    const newQuantities = { ...prev };
                    delete newQuantities[productId];
                    return newQuantities;
                });
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const addToCartFromWishlist = async (product) => {
        const username = localStorage.getItem('username');
        const quantity = quantities[product.id] || 1;
        
        try {
            const response = await fetch("http://localhost:8080/addToCart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product.id,
                    username: username,
                    quantity: quantity,
                }),
            });

            if (response.ok) {
                alert('Product added to cart!');
                removeFromWishlist(product.id);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleQuantityChange = (productId, change) => {
        const currentQuantity = quantities[productId] || 1;
        const newQuantity = Math.max(1, currentQuantity + change);
        updateQuantity(productId, newQuantity);
    };

    if (loading) {
        return <div className="wishlist-loading">Loading wishlist...</div>;
    }

    return (
        <div className="wishlist-container">
            <h2>My Wishlist</h2>
            
            {wishlistItems.length === 0 ? (
                <div className="empty-wishlist">
                    <div className="empty-icon">❤️</div>
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love for later</p>
                    <button onClick={() => navigate('/customer')} className="shop-now-btn">
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="wishlist-items">
                    {wishlistItems.map(product => (
                        <div key={product.id} className="wishlist-item">
                            <div className="product-image">
                                {product.photo ? (
                                    <img src={product.photo} alt={product.name} />
                                ) : (
                                    <div className="image-placeholder">📷</div>
                                )}
                            </div>
                            <div className="product-details">
                                <h4>{product.name}</h4>
                                <p className="price">Rs.{product.price}</p>
                                <p className="category">{product.category}</p>
                                
                                {/* NEW: Quantity Controls */}
                                <div className="quantity-controls">
                                    <label>Quantity:</label>
                                    <div className="quantity-selector">
                                        <button 
                                            onClick={() => handleQuantityChange(product.id, -1)}
                                            className="quantity-btn"
                                            disabled={(quantities[product.id] || 1) <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="quantity-display">{quantities[product.id] || 1}</span>
                                        <button 
                                            onClick={() => handleQuantityChange(product.id, 1)}
                                            className="quantity-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="wishlist-actions">
                                <button 
                                    onClick={() => addToCartFromWishlist(product)}
                                    className="add-to-cart-btn"
                                >
                                    Add to Cart ({(quantities[product.id] || 1)})
                                </button>
                                <button 
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="remove-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;