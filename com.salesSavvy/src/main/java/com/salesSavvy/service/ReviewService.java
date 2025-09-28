package com.salesSavvy.service;

import com.salesSavvy.entity.Review;
import java.util.List;
import java.util.Map;

public interface ReviewService {
    Review addReview(Review review);
    List<Review> getReviewsByProductId(Long productId);
    List<Review> getReviewsByUsername(String username);
    boolean deleteReview(Long reviewId, String username);
    Map<String, Object> getProductRatingSummary(Long productId);
    boolean hasUserPurchasedProduct(String username, Long productId);
}