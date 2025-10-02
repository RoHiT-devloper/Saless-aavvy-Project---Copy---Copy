import React, { useState, useEffect } from "react";
import "./Show_All_Product.css";

const Show_All_Product = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, selectedCategory]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/getAllProducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const productsData = await response.json();
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(product =>
                product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        setFilteredProducts(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleRetry = () => {
        setIsLoading(true);
        setError("");
        fetchProducts();
    };

    // Get unique categories for filter dropdown
    const categories = ["all", ...new Set(products.map(product => product.category).filter(Boolean))];

    if (isLoading) {
        return (
            <div className="show-all-products-container">
                <div className="products-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading products catalog...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="show-all-products-container">
                <div className="products-error">
                    <div className="error-icon">⚠️</div>
                    <h3>Failed to Load Products</h3>
                    <p>{error}</p>
                    <button onClick={handleRetry} className="retry-button">
                        <span className="button-icon">🔄</span>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="show-all-products-container">
            {/* Header Section */}
            <div className="products-header">
                <div className="header-content">
                    <h1 className="products-title">
                        <span className="title-icon">📦</span>
                        Product Catalog
                    </h1>
                    <p className="header-subtitle">Browse and explore our complete product collection</p>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-number">{products.length}</span>
                        <span className="stat-label">Total Products</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{filteredProducts.length}</span>
                        <span className="stat-label">Showing</span>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="products-controls-section">
                <div className="controls-container">
                    <div className="search-container">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search products by name, description, or category..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                        </div>
                    </div>
                    
                    <div className="filter-container">
                        <div className="filter-box">
                            <span className="filter-icon">📂</span>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="category-filter"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === "all" ? "All Categories" : category}
                                    </option>
                                ))}
                            </select>
                        </div>
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
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="products-empty">
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No Products Found</h3>
                        <p>
                            {searchTerm || selectedCategory !== "all" 
                                ? "Try adjusting your search or filter criteria" 
                                : "No products available in the catalog"
                            }
                        </p>
                        {(searchTerm || selectedCategory !== "all") && (
                            <button 
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("all");
                                }} 
                                className="clear-filters-btn"
                            >
                                <span className="button-icon">🔄</span>
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="products-grid-container">
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                {/* Product Image */}
                                <div className="product-image">
                                    {product.photo ? (
                                        <img 
                                            src={product.photo} 
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div 
                                        className="image-placeholder"
                                        style={{display: product.photo ? 'none' : 'flex'}}
                                    >
                                        <span className="placeholder-icon">📷</span>
                                        <span className="placeholder-text">No Image</span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="product-info">
                                    <div className="product-header">
                                        <span className="product-id">#{product.id}</span>
                                        <h3 className="product-name">{product.name}</h3>
                                    </div>
                                    
                                    <div className="product-price">Rs.{product.price}</div>
                                    
                                    <div className="product-category">
                                        {product.category}
                                    </div>
                                    
                                    <p className="product-description">
                                        {product.description}
                                    </p>

                                    {/* Reviews Section */}
                                    {product.reviews && product.reviews.length > 0 && (
                                        <div className="product-reviews">
                                            <div className="reviews-header">
                                                <span className="reviews-icon">⭐</span>
                                                <span className="reviews-count">Reviews ({product.reviews.length})</span>
                                            </div>
                                            <div className="reviews-list">
                                                {product.reviews.slice(0, 2).map((review, index) => (
                                                    <div key={index} className="review-item">
                                                        "{review}"
                                                    </div>
                                                ))}
                                                {product.reviews.length > 2 && (
                                                    <div className="review-more">
                                                        +{product.reviews.length - 2} more reviews
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Show_All_Product;