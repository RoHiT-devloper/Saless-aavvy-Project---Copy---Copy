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
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics(
            @RequestParam(defaultValue = "monthly") String timeRange) {
        try {
            Map<String, Object> analytics = analyticsService.getDashboardAnalytics(timeRange);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> getSalesAnalytics(
            @RequestParam(defaultValue = "monthly") String timeRange) {
        try {
            Map<String, Object> salesData = analyticsService.getDashboardAnalytics(timeRange);
            return ResponseEntity.ok(salesData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}