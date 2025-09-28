package com.salesSavvy.controller;

import com.salesSavvy.entity.ActivityLog;
import com.salesSavvy.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
public class ActivityLogController {
    
    @Autowired
    private ActivityLogService activityLogService;
    
    @GetMapping("/recent")
    public ResponseEntity<List<ActivityLog>> getRecentActivities() {
        List<ActivityLog> activities = activityLogService.getRecentActivities();
        return ResponseEntity.ok(activities);
    }
    
    @GetMapping("/recent/{count}")
    public ResponseEntity<List<ActivityLog>> getRecentActivities(@PathVariable int count) {
        List<ActivityLog> activities = activityLogService.getRecentActivities(count);
        return ResponseEntity.ok(activities);
    }
    
    @GetMapping("/type/{activityType}")
    public ResponseEntity<List<ActivityLog>> getActivitiesByType(@PathVariable String activityType) {
        List<ActivityLog> activities = activityLogService.getActivitiesByType(activityType);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ActivityLog>> getAllActivities() {
        List<ActivityLog> activities = activityLogService.getAllActivities();
        return ResponseEntity.ok(activities);
    }
}