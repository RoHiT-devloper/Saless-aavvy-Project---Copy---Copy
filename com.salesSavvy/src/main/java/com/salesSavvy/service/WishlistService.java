package com.salesSavvy.service;

import com.salesSavvy.entity.Product;
import com.salesSavvy.entity.Wishlist;
import java.util.List;

public interface WishlistService {
    Wishlist getOrCreateWishlist(String username);
    Wishlist addToWishlist(String username, Long productId);
    Wishlist removeFromWishlist(String username, Long productId);
    List<Product> getWishlistProducts(String username);
    boolean isProductInWishlist(String username, Long productId);
}