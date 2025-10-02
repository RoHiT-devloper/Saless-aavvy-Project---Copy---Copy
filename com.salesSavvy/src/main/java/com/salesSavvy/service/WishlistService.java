// /com.salesSavvy/src/main/java/com/salesSavvy/service/WishlistService.java
package com.salesSavvy.service;

import com.salesSavvy.entity.Product;
import com.salesSavvy.entity.Wishlist;
import java.util.List;

public interface WishlistService {
    // KEEP all existing methods
    Wishlist getOrCreateWishlist(String username);
    Wishlist addToWishlist(String username, Long productId);
    Wishlist removeFromWishlist(String username, Long productId);
    List<Product> getWishlistProducts(String username);
    boolean isProductInWishlist(String username, Long productId);
    
    // NEW: Add only quantity methods
    Wishlist updateQuantity(String username, Long productId, int quantity);
    Integer getProductQuantity(String username, Long productId);
}