import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Wishlist.css';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
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
                const data = await response.json();
                setWishlistItems(data);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
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
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const addToCartFromWishlist = async (product) => {
        const username = localStorage.getItem('username');
        try {
            const response = await fetch("http://localhost:8080/addToCart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product.id,
                    username: username,
                    quantity: 1,
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
                            </div>
                            <div className="wishlist-actions">
                                <button 
                                    onClick={() => addToCartFromWishlist(product)}
                                    className="add-to-cart-btn"
                                >
                                    Add to Cart
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