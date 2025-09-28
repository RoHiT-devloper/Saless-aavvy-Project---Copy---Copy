package com.salesSavvy.service;

import com.salesSavvy.entity.Coupon;
import java.util.List;
import java.util.Map;

public interface CouponService {
    Coupon validateCoupon(String code, Double orderAmount);
    Coupon applyCoupon(String code, String username);
    List<Coupon> getActiveCoupons();
    Map<String, Object> calculateDiscount(Double orderAmount, String couponCode);
}