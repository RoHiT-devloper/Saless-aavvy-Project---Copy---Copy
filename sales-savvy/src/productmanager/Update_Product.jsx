import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Update_Product.css";

const Update_Product = () => {
    const [productId, setProductId] = useState("");
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        price: "",
        photo: "",
        category: "",
        reviews: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("browse"); // "browse" or "manual"
    const navigate = useNavigate();

    // Fetch all products on component mount
    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/getAllProducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status}`);
            }

            const productsData = await response.json();
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to load products. Please try again.");
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleIdChange = (e) => {
        setProductId(e.target.value);
        setError("");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleProductSelect = (product) => {
        setProductId(product.id.toString());
        setActiveTab("manual");
        loadProduct(product.id.toString());
    };

    const validateId = (id) => {
        if (!id.trim()) {
            setError("Product ID is required");
            return false;
        }
        
        if (isNaN(id) || Number(id) <= 0) {
            setError("Please enter a valid Product ID");
            return false;
        }
        
        return true;
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("Product name is required");
            return false;
        }
        
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
            setError("Please enter a valid price");
            return false;
        }
        
        if (!formData.description.trim()) {
            setError("Description is required");
            return false;
        }
        
        if (!formData.category.trim()) {
            setError("Category is required");
            return false;
        }
        
        return true;
    };

    const loadProduct = async (id) => {
        setError("");
        
        if (!validateId(id)) return;
        
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/searchProduct?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Product not found");
                }
                throw new Error(`Server returned ${response.status}`);
            }

            const productData = await response.json();
            
            if (!productData || !productData.id) {
                throw new Error("Invalid product data received");
            }
            
            setProduct(productData);
            
            // Pre-fill the form with existing data
            setFormData({
                id: productData.id,
                name: productData.name || "",
                description: productData.description || "",
                price: productData.price || "",
                photo: productData.photo || "",
                category: productData.category || "",
                reviews: productData.reviews ? productData.reviews.join(", ") : ""
            });
            
        } catch (error) {
            console.error("Error searching product:", error);
            setError(error.message || "Product not found or error fetching product details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setActiveTab("manual");
        loadProduct(productId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        setIsUpdating(true);

        const productData = {
            id: formData.id,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            photo: formData.photo,
            category: formData.category,
            reviews: formData.reviews ? formData.reviews.split(",").map(r => r.trim()).filter(r => r) : []
        };

        try {
            const response = await fetch('http://localhost:8080/updateProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server returned ${response.status}`);
            }

            const result = await response.text();
            setSuccessMessage(result || "Product updated successfully!");
            setShowSuccessPopup(true);
            
            // Refresh the products list
            fetchAllProducts();
            
        } catch (error) {
            console.error("Error updating product:", error);
            setError(error.message || "Failed to update product. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePopupOk = () => {
        setShowSuccessPopup(false);
        handleReset();
    };

    const handleReset = () => {
        setProductId("");
        setProduct(null);
        setFormData({
            id: "",
            name: "",
            description: "",
            price: "",
            photo: "",
            category: "",
            reviews: ""
        });
        setError("");
        setActiveTab("browse");
    };

    const handleRefreshProducts = () => {
        setIsLoadingProducts(true);
        setError("");
        fetchAllProducts();
    };

    return (
        <div className="update-product-container">
            {/* Header Section */}
            <div className="update-product-header">
                <div className="header-content">
                    <h1 className="update-product-title">
                        <span className="title-icon">🔄</span>
                        Update Product
                    </h1>
                    <p className="header-subtitle">Modify existing product information in your catalog</p>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-number">{products.length}</span>
                        <span className="stat-label">Total Products</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="update-product-content">
                {/* Navigation Tabs */}
                <div className="navigation-tabs">
                    <button 
                        className={`tab-button ${activeTab === "browse" ? "active" : ""}`}
                        onClick={() => setActiveTab("browse")}
                    >
                        <span className="tab-icon">📋</span>
                        Browse Products
                    </button>
                    <button 
                        className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
                        onClick={() => setActiveTab("manual")}
                    >
                        <span className="tab-icon">⌨️</span>
                        Manual Entry
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {/* Browse Products Tab */}
                {activeTab === "browse" && (
                    <div className="browse-section">
                        <div className="section-header">
                            <h3>Select Product to Update</h3>
                            <button 
                                onClick={handleRefreshProducts} 
                                disabled={isLoadingProducts}
                                className="refresh-button"
                            >
                                <span className="refresh-icon">🔄</span>
                                {isLoadingProducts ? "Refreshing..." : "Refresh List"}
                            </button>
                        </div>

                        {isLoadingProducts ? (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <p>Loading products catalog...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📦</div>
                                <h3>No Products Found</h3>
                                <p>There are no products in the system to update.</p>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {products.map(product => (
                                    <div 
                                        key={product.id} 
                                        className={`product-card ${productId === product.id.toString() ? 'selected' : ''}`}
                                        onClick={() => handleProductSelect(product)}
                                    >
                                        <div className="product-image">
                                            {product.photo ? (
                                                <img src={product.photo} alt={product.name} />
                                            ) : (
                                                <div className="image-placeholder">📷</div>
                                            )}
                                        </div>
                                        <div className="product-info">
                                            <span className="product-id">#{product.id}</span>
                                            <h4 className="product-name">{product.name}</h4>
                                            <div className="product-price">${product.price}</div>
                                            <span className="product-category">{product.category}</span>
                                            <div className="product-action">
                                                <span className="action-text">Click to edit</span>
                                                <span className="action-arrow">→</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Manual Entry Tab */}
                {activeTab === "manual" && (
                    <div className="manual-section">
                        {!product ? (
                            <div className="search-form-container">
                                <div className="form-header">
                                    <h3>Enter Product ID</h3>
                                    <p>Search for a product by its unique identifier</p>
                                </div>
                                <form onSubmit={handleSearch} className="search-form">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-icon">🔍</span>
                                            Product ID
                                        </label>
                                        <input
                                            type="number"
                                            name="productId"
                                            value={productId}
                                            onChange={handleIdChange}
                                            disabled={isLoading}
                                            min="1"
                                            className="form-input"
                                            placeholder="Enter product ID (e.g., 123)"
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="submit-button primary"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="button-spinner"></span>
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <span className="button-icon">🔍</span>
                                                Search Product
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="edit-form-container">
                                <div className="form-header">
                                    <div className="header-left">
                                        <h3>Editing Product</h3>
                                        <p>Update the details for <strong>{product.name}</strong></p>
                                    </div>
                                    <button 
                                        onClick={handleReset}
                                        className="back-button"
                                    >
                                        <span className="button-icon">←</span>
                                        Back to Search
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="edit-form">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label required">
                                                <span className="label-icon">📛</span>
                                                Product Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleFormChange}
                                                disabled={isUpdating}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label required">
                                                <span className="label-icon">💰</span>
                                                Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleFormChange}
                                                disabled={isUpdating}
                                                min="0"
                                                step="0.01"
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group full-width">
                                            <label className="form-label required">
                                                <span className="label-icon">📝</span>
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleFormChange}
                                                disabled={isUpdating}
                                                className="form-textarea"
                                                rows="4"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label">
                                                <span className="label-icon">🖼️</span>
                                                Photo URL
                                            </label>
                                            <input
                                                type="url"
                                                name="photo"
                                                value={formData.photo}
                                                onChange={handleFormChange}
                                                disabled={isUpdating}
                                                className="form-input"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label required">
                                                <span className="label-icon">📂</span>
                                                Category
                                            </label>
                                            <input
                                                type="text"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleFormChange}
                                                disabled={isUpdating}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group full-width">
                                            <label className="form-label">
                                                <span className="label-icon">⭐</span>
                                                Reviews (comma separated)
                                            </label>
                                            <input
                                                type="text"
                                                name="reviews"
                                                value={formData.reviews}
                                                onChange={handleFormChange}
                                                disabled={isUpdating}
                                                className="form-input"
                                                placeholder="Great product, Fast shipping, Excellent quality"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-actions">
                                        <button 
                                            type="submit" 
                                            disabled={isUpdating}
                                            className="submit-button success"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <span className="button-spinner"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="button-icon">✅</span>
                                                    Update Product
                                                </>
                                            )}
                                        </button>
                                        
                                        <button 
                                            type="button" 
                                            onClick={handleReset}
                                            className="submit-button secondary"
                                        >
                                            <span className="button-icon">❌</span>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="success-popup-overlay">
                    <div className="success-popup">
                        <div className="popup-content">
                            <div className="popup-icon">🎉</div>
                            <h3>Update Successful!</h3>
                            <p>{successMessage}</p>
                            <button 
                                onClick={handlePopupOk}
                                className="popup-button"
                            >
                                Continue Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Update_Product;