package com.salesSavvy.repository;

import com.salesSavvy.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Users findByUsername(String username);
    Users findByPassword(String password);
    Users findByEmail(String email);
    
    // Simple method name without @Query
    List<Users> findTop1ByOrderByCreatedAtDesc();
}