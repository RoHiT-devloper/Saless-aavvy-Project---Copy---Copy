package com.salesSavvy.service;

import com.salesSavvy.entity.Review;
import com.salesSavvy.repository.ReviewRepository;
import com.salesSavvy.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewServiceImpl implements ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private HttpServletRequest request;
    
    @Override
    public Review addReview(Review review) {
        // Check if user has already reviewed this product
        if (reviewRepository.existsByUsernameAndProductId(review.getUsername(), review.getProductId())) {
            throw new IllegalArgumentException("You have already reviewed this product");
        }
        
        // Verify purchase if required
        if (review.getVerifiedPurchase()) {
            boolean hasPurchased = hasUserPurchasedProduct(review.getUsername(), review.getProductId());
            review.setVerifiedPurchase(hasPurchased);
        }
        
        Review savedReview = reviewRepository.save(review);
        
        // Log the activity
        activityLogService.logActivity(
            ActivityLogService.REVIEW_ADDED,
            "Review added for product ID: " + savedReview.getProductId() + " by " + savedReview.getUsername(),
            savedReview.getUsername(),
            savedReview.getId().toString(),
            "REVIEW",
            request
        );
        
        return savedReview;
    }
    
    @Override
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }
    
    @Override
    public List<Review> getReviewsByUsername(String username) {
        return reviewRepository.findByUsername(username);
    }
    
    @Override
    public boolean deleteReview(Long reviewId, String username) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        
        if (!review.getUsername().equals(username)) {
            throw new IllegalArgumentException("You can only delete your own reviews");
        }
        
        reviewRepository.delete(review);

        // Log the activity
        activityLogService.logActivity(
            ActivityLogService.REVIEW_ADDED, // We can create REVIEW_DELETED if needed
            "Review deleted for product ID: " + review.getProductId() + " by " + review.getUsername(),
            review.getUsername(),
            review.getId().toString(),
            "REVIEW"
        );
        
        return true;
    }
    
    @Override
    public Map<String, Object> getProductRatingSummary(Long productId) {
        Map<String, Object> summary = new HashMap<>();
        
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        Integer reviewCount = reviewRepository.countByProductId(productId);
        
        summary.put("averageRating", averageRating != null ? Math.round(averageRating * 10) / 10.0 : 0);
        summary.put("reviewCount", reviewCount);
        summary.put("productId", productId);
        
        return summary;
    }
    
    @Override
    public boolean hasUserPurchasedProduct(String username, Long productId) {
        // Check if user has any order containing this product
        List<com.salesSavvy.entity.Order> userOrders = orderRepository.findByUsername(username);
        
        return userOrders.stream()
            .flatMap(order -> order.getItems().stream())
            .anyMatch(item -> item.getProductId().equals(productId));
    }
}