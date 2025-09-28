package com.salesSavvy.service;

import com.salesSavvy.entity.ActivityLog;
import com.salesSavvy.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {
    
    @Autowired
    private ActivityLogRepository activityLogRepository;
    
    // Activity type constants
    public static final String USER_REGISTERED = "USER_REGISTERED";
    public static final String ORDER_PLACED = "ORDER_PLACED";
    public static final String PRODUCT_ADDED = "PRODUCT_ADDED";
    public static final String PRODUCT_UPDATED = "PRODUCT_UPDATED";
    public static final String USER_LOGIN = "USER_LOGIN";
    public static final String PASSWORD_CHANGED = "PASSWORD_CHANGED";
    public static final String REVIEW_ADDED = "REVIEW_ADDED";
    public static final String CART_UPDATED = "CART_UPDATED";
    public static final String WISHLIST_UPDATED = "WISHLIST_UPDATED";
    
    public void logActivity(String activityType, String description, String username, 
                          String entityId, String entityType, HttpServletRequest request) {
        try {
            String ipAddress = getClientIpAddress(request);
            ActivityLog activityLog = new ActivityLog(activityType, description, username, entityId, entityType, ipAddress);
            activityLogRepository.save(activityLog);
            System.out.println("Activity logged: " + description);
        } catch (Exception e) {
            System.err.println("Failed to log activity: " + e.getMessage());
        }
    }
    
    public void logActivity(String activityType, String description, String username, 
                          String entityId, String entityType) {
        try {
            ActivityLog activityLog = new ActivityLog(activityType, description, username, entityId, entityType);
            activityLogRepository.save(activityLog);
            System.out.println("Activity logged: " + description);
        } catch (Exception e) {
            System.err.println("Failed to log activity: " + e.getMessage());
        }
    }
    
    public List<ActivityLog> getRecentActivities(int limit) {
        try {
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30); // Last 30 days
            List<ActivityLog> activities = activityLogRepository.findRecentActivities(cutoffDate);
            return activities.size() > limit ? activities.subList(0, limit) : activities;
        } catch (Exception e) {
            System.err.println("Error fetching recent activities: " + e.getMessage());
            return List.of();
        }
    }
    
    public List<ActivityLog> getRecentActivities() {
        try {
            return activityLogRepository.findTop10ByOrderByActivityTimeDesc();
        } catch (Exception e) {
            System.err.println("Error fetching recent activities: " + e.getMessage());
            return List.of();
        }
    }
    
    public List<ActivityLog> getActivitiesByType(String activityType) {
        try {
            return activityLogRepository.findByActivityTypeOrderByActivityTimeDesc(activityType);
        } catch (Exception e) {
            System.err.println("Error fetching activities by type: " + e.getMessage());
            return List.of();
        }
    }
    
    public List<ActivityLog> getAllActivities() {
        try {
            return activityLogRepository.findAllByOrderByActivityTimeDesc();
        } catch (Exception e) {
            System.err.println("Error fetching all activities: " + e.getMessage());
            return List.of();
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        if (request == null) {
            return "Unknown";
        }
        
        try {
            String xfHeader = request.getHeader("X-Forwarded-For");
            if (xfHeader != null && !xfHeader.isEmpty()) {
                return xfHeader.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        } catch (Exception e) {
            return "Unknown";
        }
    }
}