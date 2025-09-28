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
    
    // Analytics method
    List<Users> findTop1ByOrderByCreatedAtDesc();
}