package com.salesSavvy.service;

import com.salesSavvy.entity.Product;
import java.util.List;

public interface InventoryService {
    Product updateStock(Long productId, Integer quantityChange);
    List<Product> getLowStockProducts();
    List<Product> getOutOfStockProducts();
    boolean isProductInStock(Long productId, Integer requestedQuantity);
}