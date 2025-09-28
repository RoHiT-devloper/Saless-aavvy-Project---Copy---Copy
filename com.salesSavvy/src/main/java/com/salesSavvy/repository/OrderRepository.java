package com.salesSavvy.repository;

import com.salesSavvy.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username);
    Order findByOrderId(String orderId);
    List<Order> findAllByOrderByOrderDateDesc();
    
    // Analytics methods
    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
    Long countByOrderDateBetween(LocalDateTime start, LocalDateTime end);
    
    // Recent data methods
    List<Order> findTop5ByOrderByOrderDateDesc();
    List<Order> findTop3ByOrderByOrderDateDesc();
    List<Order> findTop2ByOrderByOrderDateDesc();
}