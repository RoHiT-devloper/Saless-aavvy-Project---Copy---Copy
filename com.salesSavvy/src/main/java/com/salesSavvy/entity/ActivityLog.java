package com.salesSavvy.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String activityType; // USER_REGISTERED, ORDER_PLACED, PRODUCT_ADDED, etc.
    private String description;
    private String username;
    private String entityId; // ID of the related entity (order ID, user ID, etc.)
    private String entityType; // ORDER, USER, PRODUCT, etc.
    private LocalDateTime activityTime;
    private String ipAddress;
    
    // Constructors
    public ActivityLog() {}
    
    public ActivityLog(String activityType, String description, String username, 
                      String entityId, String entityType) {
        this.activityType = activityType;
        this.description = description;
        this.username = username;
        this.entityId = entityId;
        this.entityType = entityType;
        this.activityTime = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }
    
    public ActivityLog(String activityType, String description, String username, 
                      String entityId, String entityType, String ipAddress) {
        this(activityType, description, username, entityId, entityType);
        this.ipAddress = ipAddress;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public LocalDateTime getActivityTime() { return activityTime; }
    public void setActivityTime(LocalDateTime activityTime) { this.activityTime = activityTime; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    @Override
    public String toString() {
        return "ActivityLog{" +
                "id=" + id +
                ", activityType='" + activityType + '\'' +
                ", description='" + description + '\'' +
                ", username='" + username + '\'' +
                ", entityId='" + entityId + '\'' +
                ", entityType='" + entityType + '\'' +
                ", activityTime=" + activityTime +
                ", ipAddress='" + ipAddress + '\'' +
                '}';
    }
}