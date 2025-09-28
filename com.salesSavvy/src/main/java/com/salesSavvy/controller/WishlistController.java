package com.salesSavvy.controller;

import com.salesSavvy.entity.Product;
import com.salesSavvy.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    
    @Autowired
    private WishlistService wishlistService;
    
    @GetMapping("/{username}")
    public List<Product> getWishlist(@PathVariable String username) {
        return wishlistService.getWishlistProducts(username);
    }
    
    @PostMapping("/add")
    public ResponseEntity<?> addToWishlist(@RequestParam String username, @RequestParam Long productId) {
        try {
            var wishlist = wishlistService.addToWishlist(username, productId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Product added to wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromWishlist(@RequestParam String username, @RequestParam Long productId) {
        try {
            var wishlist = wishlistService.removeFromWishlist(username, productId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Product removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/check")
    public ResponseEntity<?> checkWishlist(@RequestParam String username, @RequestParam Long productId) {
        try {
            boolean inWishlist = wishlistService.isProductInWishlist(username, productId);
            return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}