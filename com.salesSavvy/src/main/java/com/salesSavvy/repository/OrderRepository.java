// package com.salesSavvy.repository;

// import com.salesSavvy.entity.Order;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
// import java.util.List;

// @Repository
// public interface OrderRepository extends JpaRepository<Order, Long> {
//     List<Order> findByUsername(String username);
//     Order findByOrderId(String orderId);
    
//     // This method is already provided by JpaRepository
//     // List<Order> findAll();
// }

// package com.salesSavvy.repository;

// import com.salesSavvy.entity.Order;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;
// import java.time.LocalDateTime;
// import java.util.List;

// @Repository
// public interface OrderRepository extends JpaRepository<Order, Long> {
//     List<Order> findByUsername(String username);
//     Order findByOrderId(String orderId);
//     List<Order> findAllByOrderByOrderDateDesc();
    
//     // New methods for analytics
//     List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
//     Long countByOrderDateBetween(LocalDateTime start, LocalDateTime end);
    
//     @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC LIMIT :limit")
//     List<Order> findTop5ByOrderByOrderDateDesc();
    
//     @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC LIMIT 3")
//     List<Order> findTop3ByOrderByOrderDateDesc();
// }



package com.salesSavvy.repository;

import com.salesSavvy.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username);
    Order findByOrderId(String orderId);
    List<Order> findAllByOrderByOrderDateDesc();
    
    // New methods for analytics
    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
    Long countByOrderDateBetween(LocalDateTime start, LocalDateTime end);
    
    // Fixed query methods - remove named parameters from LIMIT
    @Query(value = "SELECT * FROM orders ORDER BY order_date DESC LIMIT 5", nativeQuery = true)
    List<Order> findTop5ByOrderByOrderDateDesc();
    
    @Query(value = "SELECT * FROM orders ORDER BY order_date DESC LIMIT 3", nativeQuery = true)
    List<Order> findTop3ByOrderByOrderDateDesc();
}