// /com.salesSavvy/src/main/java/com/salesSavvy/service/WishlistServiceImpl.java
package com.salesSavvy.service;

import com.salesSavvy.entity.Product;
import com.salesSavvy.entity.Wishlist;
import com.salesSavvy.repository.WishlistRepository;
import com.salesSavvy.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistServiceImpl implements WishlistService {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    // KEEP all existing methods exactly as they are
    @Override
    public Wishlist getOrCreateWishlist(String username) {
        Optional<Wishlist> existingWishlist = wishlistRepository.findByUsername(username);
        return existingWishlist.orElseGet(() -> {
            Wishlist newWishlist = new Wishlist(username);
            return wishlistRepository.save(newWishlist);
        });
    }
    
    @Override
    public Wishlist addToWishlist(String username, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(username);
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        if (!wishlist.getProducts().contains(product)) {
            wishlist.getProducts().add(product);
            // Set default quantity to 1
            wishlist.getProductQuantities().put(productId, 1);
            return wishlistRepository.save(wishlist);
        }
        
        return wishlist;
    }
    
    @Override
    public Wishlist removeFromWishlist(String username, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(username);
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        wishlist.getProducts().remove(product);
        wishlist.getProductQuantities().remove(productId);
        return wishlistRepository.save(wishlist);
    }
    
    @Override
    public List<Product> getWishlistProducts(String username) {
        Wishlist wishlist = getOrCreateWishlist(username);
        return wishlist.getProducts();
    }
    
    @Override
    public boolean isProductInWishlist(String username, Long productId) {
        return wishlistRepository.existsByUsernameAndProductsId(username, productId);
    }
    
    // NEW: Add only quantity methods
    @Override
    public Wishlist updateQuantity(String username, Long productId, int quantity) {
        Wishlist wishlist = getOrCreateWishlist(username);
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        wishlist.updateProductQuantity(product, quantity);
        return wishlistRepository.save(wishlist);
    }
    
    @Override
    public Integer getProductQuantity(String username, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(username);
        return wishlist.getProductQuantity(productId);
    }
}