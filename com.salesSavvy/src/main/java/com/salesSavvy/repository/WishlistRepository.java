// /com.salesSavvy/src/main/java/com/salesSavvy/repository/WishlistRepository.java
package com.salesSavvy.repository;

import com.salesSavvy.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUsername(String username);
    boolean existsByUsernameAndProductsId(String username, Long productId);
}