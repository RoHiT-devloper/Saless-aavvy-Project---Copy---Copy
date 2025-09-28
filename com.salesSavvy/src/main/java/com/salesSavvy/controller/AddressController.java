package com.salesSavvy.controller;

import com.salesSavvy.entity.Address;
import com.salesSavvy.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    
    @Autowired
    private AddressRepository addressRepository;
    
    @GetMapping("/user/{username}")
    public List<Address> getUserAddresses(@PathVariable String username) {
        return addressRepository.findByUsername(username);
    }
    
    @PostMapping("/add")
    public ResponseEntity<?> addAddress(@RequestBody Address address) {
        try {
            // If this is the first address, set it as default
            List<Address> existingAddresses = addressRepository.findByUsername(address.getUsername());
            if (existingAddresses.isEmpty()) {
                address.setIsDefault(true);
            }
            
            Address savedAddress = addressRepository.save(address);
            return ResponseEntity.ok(savedAddress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{addressId}")
    public ResponseEntity<?> updateAddress(@PathVariable Long addressId, @RequestBody Address address) {
        try {
            if (!addressRepository.existsById(addressId)) {
                return ResponseEntity.notFound().build();
            }
            address.setId(addressId);
            Address updatedAddress = addressRepository.save(address);
            return ResponseEntity.ok(updatedAddress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long addressId, @RequestParam String username) {
        try {
            Optional<Address> address = addressRepository.findById(addressId);
            if (address.isPresent() && address.get().getUsername().equals(username)) {
                addressRepository.deleteById(addressId);
                return ResponseEntity.ok(Map.of("success", true, "message", "Address deleted successfully"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{addressId}/set-default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable Long addressId, @RequestParam String username) {
        try {
            // Remove default from all addresses of this user
            List<Address> userAddresses = addressRepository.findByUsername(username);
            for (Address addr : userAddresses) {
                addr.setIsDefault(false);
            }
            addressRepository.saveAll(userAddresses);
            
            // Set new default
            Optional<Address> newDefault = addressRepository.findById(addressId);
            if (newDefault.isPresent()) {
                newDefault.get().setIsDefault(true);
                addressRepository.save(newDefault.get());
                return ResponseEntity.ok(Map.of("success", true, "message", "Default address updated"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}