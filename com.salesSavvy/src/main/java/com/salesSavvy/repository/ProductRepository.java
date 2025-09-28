package com.salesSavvy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.salesSavvy.entity.Product;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Find products by category (case-insensitive partial match)
    List<Product> findByCategoryContainingIgnoreCase(String category);
    
    // Find products by name (case-insensitive partial match)
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Find products within a price range
    List<Product> findByPriceBetween(int minPrice, int maxPrice);
    
    // Custom query for advanced search
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);
}