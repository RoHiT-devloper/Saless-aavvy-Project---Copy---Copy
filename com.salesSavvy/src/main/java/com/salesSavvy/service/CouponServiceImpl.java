package com.salesSavvy.service;

import com.salesSavvy.entity.Coupon;
import com.salesSavvy.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Override
    public Coupon validateCoupon(String code, Double orderAmount) {
        Optional<Coupon> couponOpt = couponRepository.findByCode(code);
        
        if (couponOpt.isEmpty()) {
            throw new IllegalArgumentException("Coupon not found");
        }
        
        Coupon coupon = couponOpt.get();
        
        if (!coupon.isValid()) {
            throw new IllegalArgumentException("Coupon is not valid");
        }
        
        if (orderAmount < coupon.getMinOrderAmount()) {
            throw new IllegalArgumentException("Order amount must be at least " + coupon.getMinOrderAmount());
        }
        
        return coupon;
    }

    @Override
    public Coupon applyCoupon(String code, String username) {
        // For now, just validate the coupon
        // In a real application, you might want to track coupon usage per user
        return validateCoupon(code, 0.0); // Pass 0.0 as we're just validating existence
    }

    @Override
    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByActiveTrue();
    }

    @Override
    public Map<String, Object> calculateDiscount(Double orderAmount, String couponCode) {
        Coupon coupon = validateCoupon(couponCode, orderAmount);
        
        double discountAmount = 0.0;
        double finalAmount = orderAmount;
        
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = (orderAmount * coupon.getDiscountValue()) / 100;
            finalAmount = orderAmount - discountAmount;
        } else if ("FIXED_AMOUNT".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = coupon.getDiscountValue();
            finalAmount = orderAmount - discountAmount;
            
            // Ensure final amount doesn't go negative
            if (finalAmount < 0) {
                discountAmount = orderAmount;
                finalAmount = 0;
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("coupon", coupon);
        result.put("originalAmount", orderAmount);
        result.put("discountAmount", discountAmount);
        result.put("finalAmount", finalAmount);
        result.put("discountType", coupon.getDiscountType());
        
        return result;
    }
}