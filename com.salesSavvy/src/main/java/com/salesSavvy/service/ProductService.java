package com.salesSavvy.service;

import java.util.List;

import com.salesSavvy.entity.Product;
import com.salesSavvy.exception.ProductNotFoundException;

public interface ProductService {
    String addProduct(Product product);
    Product searchProduct(Long id) throws ProductNotFoundException;
    List<Product> searchProductByCategory(String category);
    List<Product> searchProductByName(String name);
    String updateProduct(Product product);
    String deleteProduct(Long id);
    List<Product> getAllProducts();
    List<Product> getProductsInPriceRange(int minPrice, int maxPrice);
    List<Product> searchProducts(String query);
}