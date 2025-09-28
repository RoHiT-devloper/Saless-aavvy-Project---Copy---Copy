package com.salesSavvy.service;

import com.salesSavvy.entity.Order;
import com.salesSavvy.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Override
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
    
    @Override
    public List<Order> getOrdersByUsername(String username) {
        return orderRepository.findByUsername(username);
    }
    
    @Override
    public Order getOrderByOrderId(String orderId) {
        return orderRepository.findByOrderId(orderId);
    }
    
    // Add these implementations
    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null; // Or throw an exception
    }
}