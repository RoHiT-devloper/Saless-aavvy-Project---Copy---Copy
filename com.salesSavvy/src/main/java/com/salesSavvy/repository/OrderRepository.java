package com.salesSavvy.repository;

import com.salesSavvy.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username);
    Order findByOrderId(String orderId);
    
    // This method is already provided by JpaRepository
    // List<Order> findAll();
}