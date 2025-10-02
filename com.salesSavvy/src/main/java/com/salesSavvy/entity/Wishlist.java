// /com.salesSavvy/src/main/java/com/salesSavvy/entity/Wishlist.java
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
    
    // NEW: Add quantity tracking
    @ElementCollection
    @CollectionTable(
        name = "wishlist_product_quantities",
        joinColumns = @JoinColumn(name = "wishlist_id")
    )
    @MapKeyJoinColumn(name = "product_id")
    @Column(name = "quantity")
    private java.util.Map<Long, Integer> productQuantities = new java.util.HashMap<>();
    
    // Constructors
    public Wishlist() {}
    
    public Wishlist(String username) {
        this.username = username;
    }
    
    // KEEP all existing methods and ADD new quantity methods
    
    // Existing methods (keep these)
    public void addProduct(Product product) {
        if (!products.contains(product)) {
            products.add(product);
            // Set default quantity to 1 when adding product
            productQuantities.put(product.getId(), 1);
        }
    }
    
    public void removeProduct(Product product) {
        products.remove(product);
        productQuantities.remove(product.getId());
    }
    
    public boolean containsProduct(Product product) {
        return products.contains(product);
    }
    
    // NEW: Quantity methods
    public void updateProductQuantity(Product product, int quantity) {
        if (products.contains(product)) {
            if (quantity <= 0) {
                removeProduct(product);
            } else {
                productQuantities.put(product.getId(), quantity);
            }
        }
    }
    
    public int getProductQuantity(Product product) {
        return productQuantities.getOrDefault(product.getId(), 1);
    }
    
    public int getProductQuantity(Long productId) {
        return productQuantities.getOrDefault(productId, 1);
    }
    
    // Getters and setters (keep existing and add new)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public List<Product> getProducts() { return products; }
    public void setProducts(List<Product> products) { this.products = products; }
    
    public java.util.Map<Long, Integer> getProductQuantities() { return productQuantities; }
    public void setProductQuantities(java.util.Map<Long, Integer> productQuantities) { 
        this.productQuantities = productQuantities; 
    }
}