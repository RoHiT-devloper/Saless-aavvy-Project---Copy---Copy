package com.salesSavvy.service;

import com.salesSavvy.entity.Cart;

public interface CartService {
    void addCart(Cart cart);
    Cart getCartById(Long id);
    void deleteCart(Cart cart);
}