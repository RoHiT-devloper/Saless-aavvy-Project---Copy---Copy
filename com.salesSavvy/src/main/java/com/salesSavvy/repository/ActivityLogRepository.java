package com.salesSavvy.repository;

import com.salesSavvy.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    List<ActivityLog> findByActivityTimeBetweenOrderByActivityTimeDesc(LocalDateTime start, LocalDateTime end);
    
    List<ActivityLog> findTop10ByOrderByActivityTimeDesc();
    
    List<ActivityLog> findByActivityTypeOrderByActivityTimeDesc(String activityType);
    
    List<ActivityLog> findByUsernameOrderByActivityTimeDesc(String username);
    
    @Query("SELECT a FROM ActivityLog a WHERE a.activityTime >= :cutoffDate ORDER BY a.activityTime DESC")
    List<ActivityLog> findRecentActivities(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    long countByActivityTimeAfter(LocalDateTime date);
    
    @Query("SELECT a FROM ActivityLog a ORDER BY a.activityTime DESC")
    List<ActivityLog> findAllByOrderByActivityTimeDesc();
}