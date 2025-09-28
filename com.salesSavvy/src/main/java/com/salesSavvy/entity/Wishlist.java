package com.salesSavvy.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wishlists")
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String username;
    
    @ManyToMany
    @JoinTable(
        name = "wishlist_products",
        joinColumns = @JoinColumn(name = "wishlist_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products = new ArrayList<>();
    
    // Constructors
    public Wishlist() {}
    
    public Wishlist(String username) {
        this.username = username;
    }
    
    // Helper methods
    public void addProduct(Product product) {
        if (!products.contains(product)) {
            products.add(product);
        }
    }
    
    public void removeProduct(Product product) {
        products.remove(product);
    }
    
    public boolean containsProduct(Product product) {
        return products.contains(product);
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public List<Product> getProducts() { return products; }
    public void setProducts(List<Product> products) { this.products = products; }
}