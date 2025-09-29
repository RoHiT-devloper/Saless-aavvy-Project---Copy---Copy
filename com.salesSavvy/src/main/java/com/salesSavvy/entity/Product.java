package com.salesSavvy.entity;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    @Column(length = 2000)
    private String description;
    private int price;
    @Column(length = 4000)
    private String photo;
    private String category;

    private Integer stockQuantity = 0;
    private Integer lowStockThreshold = 10;
    private Boolean inStock = true;
    private Integer salesCount = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));

    @ElementCollection
    private List<String> reviews;

    public Product() {}

    public Product(Long id, String name, String description, int price, String photo, String category, List<String> reviews) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.photo = photo;
        this.category = category;
        this.reviews = reviews;
        this.updatedAt = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getReviews() { return reviews; }
    public void setReviews(List<String> reviews) { this.reviews = reviews; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { 
        this.stockQuantity = stockQuantity; 
        this.inStock = stockQuantity > 0;
    }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { 
        this.lowStockThreshold = lowStockThreshold; 
    }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Integer getSalesCount() { return salesCount; }
    public void setSalesCount(Integer salesCount) { this.salesCount = salesCount; }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", category='" + category + '\'' +
                '}'; 
    }
}