package com.salesSavvy.service;

import com.salesSavvy.entity.Order;
import com.salesSavvy.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private HttpServletRequest request;
    
    @Override
    public Order saveOrder(Order order) {
        // Ensure order date is not set by frontend - let @PrePersist handle it
        order.setOrderDate(null);
        
        Order savedOrder = orderRepository.save(order);
        
        // Log the activity
        activityLogService.logActivity(
            ActivityLogService.ORDER_PLACED,
            "New order #" + savedOrder.getOrderId() + " placed by " + savedOrder.getUsername(),
            savedOrder.getUsername(),
            savedOrder.getOrderId(),
            "ORDER",
            request
        );
        
        return savedOrder;
    }
    
    @Override
    public List<Order> getOrdersByUsername(String username) {
        return orderRepository.findByUsername(username);
    }
    
    @Override
    public Order getOrderByOrderId(String orderId) {
        return orderRepository.findByOrderId(orderId);
    }
    
    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            String oldStatus = order.getStatus();
            order.setStatus(status);
            Order updatedOrder = orderRepository.save(order);

            // Log the activity
            activityLogService.logActivity(
                ActivityLogService.ORDER_PLACED,
                "Order #" + updatedOrder.getOrderId() + " status changed from " + oldStatus + " to " + status,
                "admin",
                updatedOrder.getOrderId(),
                "ORDER"
            );
            
            return updatedOrder;
        }
        return null;
    }
}