package com.salesSavvy.repository;

import com.salesSavvy.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
Optional<Coupon> findByCode(String code);
    
    @Query("SELECT c FROM Coupon c WHERE c.active = true AND c.validFrom <= :now AND c.validTo >= :now")
    List<Coupon> findActiveCoupons(@Param("now") LocalDateTime now);
    
    List<Coupon> findByActiveTrue();
}