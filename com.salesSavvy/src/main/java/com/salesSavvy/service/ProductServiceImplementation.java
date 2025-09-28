package com.salesSavvy.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salesSavvy.entity.Product;
import com.salesSavvy.exception.ProductNotFoundException;
import com.salesSavvy.repository.ProductRepository;

@Service
@Transactional
public class ProductServiceImplementation implements ProductService {

    @Autowired
    ProductRepository repo;

    @Override
    public String addProduct(Product product) {
        try {
            validateProduct(product);
            repo.save(product);
            return "Product added successfully";
        } catch (IllegalArgumentException e) {
            return "Failed to add product: " + e.getMessage();
        } catch (Exception e) {
            return "Failed to add product due to unexpected error";
        }
    }

    @Override
    public Product searchProduct(Long id) {
        Optional<Product> product = repo.findById(id);
        if (product.isPresent()) {
            return product.get();
        } else {
            throw new ProductNotFoundException("Product with ID " + id + " not found");
        }
    }

    @Override
    public String updateProduct(Product product) {
        try {
            if (!repo.existsById(product.getId())) {
                return "Product not found";
            }
            
            validateProduct(product);
            repo.save(product);
            return "Product updated successfully";
        } catch (IllegalArgumentException e) {
            return "Failed to update product: " + e.getMessage();
        } catch (Exception e) {
            return "Failed to update product due to unexpected error";
        }
    }

    @Override
    public String deleteProduct(Long id) {
        try {
            if (!repo.existsById(id)) {
                return "Product not found";
            }
            
            repo.deleteById(id);
            return "Product deleted successfully";
        } catch (EmptyResultDataAccessException e) {
            return "Product not found";
        } catch (Exception e) {
            return "Failed to delete product due to unexpected error";
        }
    }

    @Override
    public List<Product> searchProductByCategory(String category) {
        return repo.findByCategoryContainingIgnoreCase(category);
    }
    
    @Override
    public List<Product> searchProductByName(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Product> getAllProducts() {
        return repo.findAll();
    }
    
    @Override
    public List<Product> getProductsInPriceRange(int minPrice, int maxPrice) {
        return repo.findByPriceBetween(minPrice, maxPrice);
    }

    @Override
    public List<Product> searchProducts(String query) {
        return repo.searchProducts(query);
    }

    // Helper method to validate product data
    private void validateProduct(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (product.getPrice() <= 0) {
            throw new IllegalArgumentException("Product price must be positive");
        }
        if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Product category is required");
        }
    }
}