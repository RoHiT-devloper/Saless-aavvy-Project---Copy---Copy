// // package com.salesSavvy.repository;

// // import org.springframework.data.jpa.repository.JpaRepository;

// // import com.salesSavvy.entity.Users;

// // public interface UsersRepository extends JpaRepository<Users, Long> {
// // 	Users findByUsername(String username);
// // 	Users findByPassword(String password);
// // 	// In UsersRepository.java
// // 	Users findByEmail(String email);
// // }


// package com.salesSavvy.repository;

// import com.salesSavvy.entity.Users;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.stereotype.Repository;
// import java.util.List;

// @Repository
// public interface UsersRepository extends JpaRepository<Users, Long> {
//     Users findByUsername(String username);
//     Users findByPassword(String password);
//     Users findByEmail(String email);
    
//     // New method for analytics
//     @Query("SELECT u FROM Users u ORDER BY u.id DESC LIMIT 1")
//     List<Users> findTop1ByOrderByIdDesc();
// }


package com.salesSavvy.repository;

import com.salesSavvy.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Users findByUsername(String username);
    Users findByPassword(String password);
    Users findByEmail(String email);
    
    // Fixed query method
    @Query(value = "SELECT * FROM users ORDER BY id DESC LIMIT 1", nativeQuery = true)
    List<Users> findTop1ByOrderByIdDesc();
}