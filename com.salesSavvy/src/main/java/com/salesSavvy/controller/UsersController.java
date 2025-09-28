package com.salesSavvy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.salesSavvy.entity.Users;
import com.salesSavvy.service.UsersService;
import com.salesSavvy.service.ProductService;

@RestController
@RequestMapping("/api/auth")
public class UsersController {
    
    @Autowired
    UsersService service;

    @Autowired
    ProductService productService;
    
    @PostMapping("/data")
    public String data(@RequestBody String username) {
        System.out.println("Data Received: "  + username);
        return "Data Received: " + username;
    }
    
    // Change this endpoint to match your frontend call
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Users user) {
        try {
            Map<String, Object> result = service.signUp(user);
            boolean success = (Boolean) result.get("success");
            
            if (success) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    // Also add the old endpoint for backward compatibility
    @PostMapping("/signUp")
    public ResponseEntity<?> signUpOld(@RequestBody Users user) {
        return signUp(user);
    }
    
@PostMapping("/signin")
public ResponseEntity<?> signIn(@RequestBody Users user) {
    Map<String, Object> response = new HashMap<>();
    
    try {
        String username = user.getUsername();
        String password = user.getPassword();
        
        if (username == null || username.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Username is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (password == null || password.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Password is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        Users u = service.getUser(username);
        if (u == null) {
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(response);
        }

        boolean isValid = service.validate(username, password);
        System.out.println("Login validation result for " + username + ": " + isValid);
        
        if (isValid) {
            // Create safe user object without password
            Map<String, Object> safeUser = new HashMap<>();
            safeUser.put("id", u.getId());
            safeUser.put("username", u.getUsername());
            safeUser.put("email", u.getEmail());
            safeUser.put("role", u.getRole());
            safeUser.put("gender", u.getGender());
            safeUser.put("dob", u.getDob());
            
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("user", safeUser);
            
            if (u.getRole().equals("admin")) {
                response.put("redirect", "admin");
            } else {
                response.put("redirect", "customer");
                // Include product list for customer
                response.put("products", productService.getAllProducts());
            }
            
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(response);
        }
    } catch (Exception e) {
        System.out.println("Error during signin: " + e.getMessage());
        e.printStackTrace();
        response.put("success", false);
        response.put("message", "Login failed: " + e.getMessage());
        return ResponseEntity.status(500).body(response);
    }
}
    // Old signin endpoint for compatibility
    @PostMapping("/signIn")
    public ResponseEntity<?> signInOld(@RequestBody Users user) {
        return signIn(user);
    }
    
    @GetMapping("/deleteUser")
    public String deleteUser(@RequestParam long id) {
        return service.deleteUser(id);
    }
    
        @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            String result = service.deleteUser(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting user: " + e.getMessage());
        }
    }
    // Updated endpoints with proper REST conventions
    @GetMapping("/users")
    public List<Users> getAllUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/verifyUserRole")
    public ResponseEntity<Map<String, Object>> verifyUserRole(@RequestParam String username) {
        Map<String, Object> response = new HashMap<>();
        try {
            Users user = service.getUser(username);
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            response.put("success", true);
            response.put("role", user.getRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error verifying user role");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    @PostMapping("/validate-password")
    public ResponseEntity<?> validatePassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String password = request.get("password");
        
        if (password == null) {
            response.put("valid", false);
            response.put("message", "Password is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean isValid = service.validatePasswordStrength(password);
        response.put("valid", isValid);
        
        if (!isValid) {
            response.put("message", "Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character");
        } else {
            response.put("message", "Password is strong");
        }
        
        return ResponseEntity.ok(response);
    }
}