package com.salesSavvy.controller;

import com.salesSavvy.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardAnalytics(
            @RequestParam(defaultValue = "monthly") String timeRange) {
        try {
            Map<String, Object> analytics = analyticsService.getDashboardAnalytics(timeRange);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            // Return a safe error response
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Unable to load analytics",
                "message", "Please try again later"
            ));
        }
    }

    @GetMapping("/sales")
    public ResponseEntity<?> getSalesAnalytics(
            @RequestParam(defaultValue = "monthly") String timeRange) {
        try {
            Map<String, Object> analytics = analyticsService.getDashboardAnalytics(timeRange);
            // Extract only sales-related data
            Map<String, Object> salesData = Map.of(
                "salesData", analytics.get("salesData"),
                "totalRevenue", analytics.get("totalRevenue"),
                "totalOrders", analytics.get("totalOrders")
            );
            return ResponseEntity.ok(salesData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Unable to load sales data"));
        }
    }
}