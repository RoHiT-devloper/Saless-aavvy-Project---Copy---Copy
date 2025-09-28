package com.salesSavvy.controller;

import com.salesSavvy.dto.CartResponse;
import com.salesSavvy.dto.CartItemResponse;
import com.salesSavvy.dto.CartRequest;
import com.salesSavvy.entity.Cart;
import com.salesSavvy.entity.CartItem;
import com.salesSavvy.entity.Users;
import com.salesSavvy.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    
    @Autowired
    private UsersService usersService;
    
    @GetMapping("/getCart")
    public CartResponse getCart(@RequestParam String username) {
        Users user = usersService.getUser(username);
        if (user == null || user.getCart() == null) {
            return new CartResponse(null, new ArrayList<>(), 0.0);
        }
        
        CartResponse response = new CartResponse();
        response.setId(user.getCart().getId());
        
        List<CartItemResponse> items = new ArrayList<>();
        double total = 0.0;
        
        for (CartItem item : user.getCart().getItems()) {
            CartItemResponse itemResponse = new CartItemResponse(item.getProduct(), item.getQuantity());
            items.add(itemResponse);
            total += itemResponse.getItemTotal();
        }
        
        response.setItems(items);
        response.setTotalPrice(total);
        return response;
    }
    
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromCart(@RequestParam Long productId, @RequestParam String username) {
        Users user = usersService.getUser(username);
        if (user == null || user.getCart() == null) {
            return ResponseEntity.badRequest().body("User or cart not found");
        }
        
        Cart cart = user.getCart();
        Optional<CartItem> itemToRemove = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
        
        if (itemToRemove.isPresent()) {
            cart.getItems().remove(itemToRemove.get());
            usersService.saveUser(user);
            return ResponseEntity.ok("Item removed from cart successfully");
        } else {
            return ResponseEntity.badRequest().body("Product not found in cart");
        }
    }
    
    @PostMapping("/update")
    public ResponseEntity<String> updateCartItem(@RequestBody CartRequest request) {
        Users user = usersService.getUser(request.getUsername());
        if (user == null || user.getCart() == null) {
            return ResponseEntity.badRequest().body("User or cart not found");
        }
        
        Cart cart = user.getCart();
        Optional<CartItem> itemToUpdate = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst();
        
        if (itemToUpdate.isPresent()) {
            CartItem item = itemToUpdate.get();
            if (request.getQuantity() <= 0) {
                // Remove item if quantity is zero or negative
                cart.getItems().remove(item);
            } else {
                item.setQuantity(request.getQuantity());
            }
            usersService.saveUser(user);
            return ResponseEntity.ok("Cart updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Product not found in cart");
        }
    }
}