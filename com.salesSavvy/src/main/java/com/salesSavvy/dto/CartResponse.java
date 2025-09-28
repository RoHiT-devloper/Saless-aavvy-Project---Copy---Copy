package com.salesSavvy.dto;

import java.util.List;

public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private double totalPrice;
    
    // Constructors
    public CartResponse() {}
    
    public CartResponse(Long id, List<CartItemResponse> items, double totalPrice) {
        this.id = id;
        this.items = items;
        this.totalPrice = totalPrice;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }
    
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}