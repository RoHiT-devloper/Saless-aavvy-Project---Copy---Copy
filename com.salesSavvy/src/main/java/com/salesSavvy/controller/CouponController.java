package com.salesSavvy.controller;

import com.salesSavvy.entity.Coupon;
import com.salesSavvy.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {
    
    @Autowired
    private CouponService couponService;
    
    @GetMapping("/active")
    public List<Coupon> getActiveCoupons() {
        return couponService.getActiveCoupons();
    }
    
    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam String code, @RequestParam Double orderAmount) {
        try {
            Coupon coupon = couponService.validateCoupon(code, orderAmount);
            Map<String, Object> discount = couponService.calculateDiscount(orderAmount, code);
            return ResponseEntity.ok(discount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/calculate")
    public ResponseEntity<?> calculateDiscount(@RequestParam Double orderAmount, @RequestParam String couponCode) {
        try {
            Map<String, Object> discount = couponService.calculateDiscount(orderAmount, couponCode);
            return ResponseEntity.ok(discount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}