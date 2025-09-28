package com.salesSavvy.dto;

import com.salesSavvy.entity.Product;

public class CartItemResponse {
    private Product product;
    private int quantity;
    private double itemTotal;
    
    // Constructors
    public CartItemResponse() {}
    
    public CartItemResponse(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
        this.itemTotal = product.getPrice() * quantity;
    }
    
    // Getters and setters
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    
    public double getItemTotal() { return itemTotal; }
    public void setItemTotal(double itemTotal) { this.itemTotal = itemTotal; }
}