package com.salesSavvy.dto;

public class CartRequest {
    private Long productId;
    private int quantity;
    private String username;

    // Constructors
    public CartRequest() {}
    
    public CartRequest(Long productId, int quantity, String username) {
        this.productId = productId;
        this.quantity = quantity;
        this.username = username;
    }

    // Getters and setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { 
        this.productId = productId; 
    }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { 
        this.quantity = quantity; 
    }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { 
        this.username = username; 
    }
}