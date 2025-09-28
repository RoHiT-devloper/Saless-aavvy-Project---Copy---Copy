package com.salesSavvy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salesSavvy.entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
}

