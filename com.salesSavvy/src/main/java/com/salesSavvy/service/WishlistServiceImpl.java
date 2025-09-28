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
}