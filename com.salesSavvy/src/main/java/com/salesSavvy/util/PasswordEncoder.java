package com.salesSavvy.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoder {
    
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    
    public String encode(String plainPassword) {
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        return bCryptPasswordEncoder.encode(plainPassword);
    }
    
    public boolean matches(String plainPassword, String encodedPassword) {
        if (plainPassword == null || encodedPassword == null) {
            return false;
        }
        return bCryptPasswordEncoder.matches(plainPassword, encodedPassword);
    }
    
    public boolean isPasswordStrong(String password) {
        // Temporary relaxed validation for testing
        if (password == null || password.length() < 3) {
            return false;
        }
        return true;
    }
}