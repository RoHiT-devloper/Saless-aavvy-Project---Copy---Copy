package com.salesSavvy.repository;

import com.salesSavvy.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUsername(String username);
    Optional<Address> findByUsernameAndIsDefaultTrue(String username);
    List<Address> findByUsernameAndAddressType(String username, String addressType);
}