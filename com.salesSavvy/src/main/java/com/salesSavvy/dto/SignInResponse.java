package com.salesSavvy.dto;

import java.util.List;
import com.salesSavvy.entity.Product;

public class SignInResponse {
    private String message;
    private List<Product> products;

    public SignInResponse(String message, List<Product> products) {
        this.message = message;
        this.products = products;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
