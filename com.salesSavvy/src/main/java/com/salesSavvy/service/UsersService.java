package com.salesSavvy.service;

import com.salesSavvy.entity.Users;
import java.util.List;
import java.util.Map;

public interface UsersService {
    Map<String, Object> signUp(Users user);
    Users getUser(String username);
    Users getPassword(String password);
    boolean validate(String username, String password);
    List<Users> getAllUsers();
    String deleteUser(Long id);
    Users saveUser(Users user);
    boolean changePassword(String username, String currentPassword, String newPassword);
    Users getUserByEmail(String email);
    boolean validatePasswordStrength(String password); // Add this method
}