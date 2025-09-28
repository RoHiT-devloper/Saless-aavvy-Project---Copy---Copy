package com.salesSavvy.service;

import com.salesSavvy.entity.Order;
import java.util.List;

public interface OrderService {
    Order saveOrder(Order order);
    List<Order> getOrdersByUsername(String username);
    Order getOrderByOrderId(String orderId);
    
    // Add these methods
    List<Order> getAllOrders();
    Order updateOrderStatus(Long orderId, String status);
}