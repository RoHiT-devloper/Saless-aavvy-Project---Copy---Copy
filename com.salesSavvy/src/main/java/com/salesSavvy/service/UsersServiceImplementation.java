package com.salesSavvy.service;

import com.salesSavvy.entity.Users;
import com.salesSavvy.repository.UsersRepository;
import com.salesSavvy.util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UsersServiceImplementation implements UsersService {
    
    @Autowired
    UsersRepository repo;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Map<String, Object> signUp(Users user) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate user data
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Username is required");
                return response;
            }
            
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Password is required");
                return response;
            }
            
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return response;
            }
            
            // Check if username already exists
            Users existingUser = repo.findByUsername(user.getUsername());
            if (existingUser != null) {
                response.put("success", false);
                response.put("message", "Username already exists");
                return response;
            }
            
            // Check if email already exists
            Users existingEmail = repo.findByEmail(user.getEmail());
            if (existingEmail != null) {
                response.put("success", false);
                response.put("message", "Email already registered");
                return response;
            }
            
            // Validate password strength
            if (!passwordEncoder.isPasswordStrong(user.getPassword())) {
                response.put("success", false);
                response.put("message", "Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character");
                return response;
            }
            
            // Hash the password before saving
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
            
            // Set default role if not provided
            if (user.getRole() == null || user.getRole().trim().isEmpty()) {
                user.setRole("customer");
            }
            
            repo.save(user);
            
            response.put("success", true);
            response.put("message", "User registered successfully");
            // Don't include the password in the response
            Users safeUser = new Users();
            safeUser.setId(user.getId());
            safeUser.setUsername(user.getUsername());
            safeUser.setEmail(user.getEmail());
            safeUser.setRole(user.getRole());
            safeUser.setGender(user.getGender());
            safeUser.setDob(user.getDob());
            response.put("user", safeUser);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
        }
        
        return response;
    }

    @Override
    public Users getUser(String username) {
        return repo.findByUsername(username);
    }

    @Override
    public Users getPassword(String password) {
        return repo.findByPassword(password);
    }

    @Override
    public boolean validate(String username, String password) {
        Users user = getUser(username);
        if (user == null) {
            System.out.println("User not found: " + username);
            return false;
        }
        
        // Debug logging
        System.out.println("Validating user: " + username);
        System.out.println("Stored password hash: " + user.getPassword());
        System.out.println("Provided password: " + password);
        
        // Use password encoder to check the password
        boolean matches = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password matches: " + matches);
        
        return matches;
    }

    @Override
    public Users saveUser(Users user) {
        return repo.save(user);
    }
    
    @Override
    public List<Users> getAllUsers() {
        return repo.findAll();
    }

    @Override
    public String deleteUser(Long id) {
        repo.deleteById(id);
        return "User deleted Successfully!";
    }
    
    @Override
    public boolean changePassword(String username, String currentPassword, String newPassword) {
        Users user = getUser(username);
        if (user == null) {
            return false;
        }
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        
        // Validate new password strength
        if (!validatePasswordStrength(newPassword)) {
            return false;
        }
        
        // Hash and set new password
        String hashedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedNewPassword);
        repo.save(user);
        
        return true;
    }
    
    @Override
    public Users getUserByEmail(String email) {
        return repo.findByEmail(email);
    }
    
    @Override
    public boolean validatePasswordStrength(String password) {
        return passwordEncoder.isPasswordStrong(password);
    }
}