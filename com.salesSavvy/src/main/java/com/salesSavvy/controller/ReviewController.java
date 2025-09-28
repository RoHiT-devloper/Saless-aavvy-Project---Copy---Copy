package com.salesSavvy.controller;

import com.salesSavvy.entity.Review;
import com.salesSavvy.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        try {
            Review savedReview = reviewService.addReview(review);
            return ResponseEntity.ok(savedReview);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProductId(productId);
    }
    
    @GetMapping("/user/{username}")
    public List<Review> getUserReviews(@PathVariable String username) {
        return reviewService.getReviewsByUsername(username);
    }
    
    @GetMapping("/summary/{productId}")
    public Map<String, Object> getRatingSummary(@PathVariable Long productId) {
        return reviewService.getProductRatingSummary(productId);
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, @RequestParam String username) {
        try {
            boolean deleted = reviewService.deleteReview(reviewId, username);
            return ResponseEntity.ok(Map.of("success", deleted, "message", "Review deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}