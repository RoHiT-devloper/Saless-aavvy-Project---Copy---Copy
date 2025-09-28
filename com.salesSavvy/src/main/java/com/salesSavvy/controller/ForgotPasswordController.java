package com.salesSavvy.controller;

import com.salesSavvy.entity.Users;
import com.salesSavvy.repository.UsersRepository;
import com.salesSavvy.service.EmailService;
import com.salesSavvy.service.UsersService;
import com.salesSavvy.util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController

@RequestMapping("/api/auth")
public class ForgotPasswordController {
    
    @Autowired
    private UsersService usersService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Enhanced OTP storage with expiration
    private Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    
    private static class OtpData {
        String otp;
        LocalDateTime expirationTime;
        int attempts;
        
        OtpData(String otp, LocalDateTime expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
            this.attempts = 0;
        }
        
        boolean isExpired() {
            return LocalDateTime.now().isAfter(expirationTime);
        }
    }

@PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    System.out.println("Forgot password request for email: " + email);
    
    if (email == null || email.trim().isEmpty()) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Email is required");
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    Users user = usersService.getUserByEmail(email);
    System.out.println("User found: " + (user != null));
    
    if (user == null) {
        // For security, don't reveal that email doesn't exist
        Map<String, String> response = new HashMap<>();
        response.put("message", "If the email exists, OTP has been sent");
        System.out.println("User not found, but returning success for security");
        return ResponseEntity.ok().body(response);
    }
    
    // Generate OTP
    String otp = generateOtp();
    LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(10);
    
    // Store OTP with expiration
    otpStorage.put(email, new OtpData(otp, expirationTime));
    System.out.println("OTP generated and stored for: " + email);
    
    // Send OTP via email
    try {
        emailService.sendOtpEmail(email, otp);
        System.out.println("OTP email sent successfully");
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully");
        return ResponseEntity.ok().body(response);
    } catch (Exception e) {
        otpStorage.remove(email); // Remove OTP if email fails
        System.out.println("Failed to send OTP email: " + e.getMessage());
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Failed to send OTP: " + e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    }
}

@PostMapping("/verify-otp")
public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String otp = request.get("otp");
    
    System.out.println("=== OTP VERIFICATION DEBUG ===");
    System.out.println("Email received: " + email);
    System.out.println("OTP received: " + otp);
    System.out.println("Current OTP storage: " + otpStorage.keySet());
    
    Map<String, String> response = new HashMap<>();
    
    if (email == null || otp == null) {
        response.put("message", "Email and OTP are required");
        return ResponseEntity.badRequest().body(response);
    }
    
    OtpData otpData = otpStorage.get(email);
    System.out.println("OTP data found: " + (otpData != null));
    
    if (otpData == null) {
        System.out.println("No OTP data found for email: " + email);
        response.put("message", "OTP not found or expired");
        return ResponseEntity.badRequest().body(response);
    }
    
    System.out.println("Stored OTP: " + otpData.otp);
    System.out.println("Received OTP: " + otp);
    System.out.println("OTP matches: " + otpData.otp.equals(otp));
    System.out.println("OTP expired: " + otpData.isExpired());
    System.out.println("Attempts: " + otpData.attempts);
    
    if (otpData.isExpired()) {
        otpStorage.remove(email);
        response.put("message", "OTP has expired");
        return ResponseEntity.badRequest().body(response);
    }
    
    if (otpData.attempts >= 3) {
        otpStorage.remove(email);
        response.put("message", "Too many failed attempts");
        return ResponseEntity.badRequest().body(response);
    }
    
    if (otpData.otp.equals(otp)) {
        // OTP verified successfully - BUT DON'T REMOVE IT YET
        // We need to keep it for the password reset step
        System.out.println("OTP verification SUCCESS - OTP kept for password reset");
        response.put("message", "OTP verified successfully");
        return ResponseEntity.ok().body(response);
    } else {
        otpData.attempts++;
        System.out.println("OTP verification FAILED - attempts: " + otpData.attempts);
        response.put("message", "Invalid OTP");
        return ResponseEntity.badRequest().body(response);
    }
}

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String otp = request.get("otp");
    String newPassword = request.get("newPassword");
    
    System.out.println("=== PASSWORD RESET DEBUG ===");
    System.out.println("Email: " + email);
    System.out.println("OTP: " + otp);
    System.out.println("New password length: " + (newPassword != null ? newPassword.length() : "null"));
    
    Map<String, String> response = new HashMap<>();
    
    if (email == null || otp == null || newPassword == null) {
        response.put("message", "All fields are required");
        return ResponseEntity.badRequest().body(response);
    }
    
    // Verify OTP first
    OtpData otpData = otpStorage.get(email);
    System.out.println("OTP data found for reset: " + (otpData != null));
    
    if (otpData == null) {
        System.out.println("No OTP data found for reset");
        response.put("message", "Invalid or expired OTP");
        return ResponseEntity.badRequest().body(response);
    }
    
    System.out.println("Stored OTP for reset: " + otpData.otp);
    System.out.println("Received OTP for reset: " + otp);
    System.out.println("OTP matches for reset: " + otpData.otp.equals(otp));
    
    if (!otpData.otp.equals(otp) || otpData.isExpired()) {
        response.put("message", "Invalid or expired OTP");
        return ResponseEntity.badRequest().body(response);
    }
    
    Users user = usersService.getUserByEmail(email);
    if (user == null) {
        response.put("message", "User not found");
        return ResponseEntity.badRequest().body(response);
    }
    
    // Validate new password strength
    if (!passwordEncoder.isPasswordStrong(newPassword)) {
        response.put("message", "Password must be at least 8 characters with uppercase, lowercase, digit, and special character");
        return ResponseEntity.badRequest().body(response);
    }
    
    // Update password with hashing
    String hashedPassword = passwordEncoder.encode(newPassword);
    user.setPassword(hashedPassword);
    usersService.saveUser(user);
    
    // Remove OTP from storage ONLY AFTER successful password reset
    otpStorage.remove(email);
    System.out.println("Password reset SUCCESS - OTP removed");
    
    response.put("message", "Password reset successfully");
    return ResponseEntity.ok().body(response);
}

@PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");
        
        if (username == null || currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }
        
        boolean success = usersService.changePassword(username, currentPassword, newPassword);
        if (success) {
            return ResponseEntity.ok().body("Password changed successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to change password. Check current password or new password requirements.");
        }
    }
    
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}