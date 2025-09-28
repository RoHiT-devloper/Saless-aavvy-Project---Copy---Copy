package com.salesSavvy.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.salesSavvy.entity.Cart;
import com.salesSavvy.entity.CartData;
import com.salesSavvy.entity.Product;
import com.salesSavvy.entity.Users;
import com.salesSavvy.service.CartService;
import com.salesSavvy.service.ProductService;
import com.salesSavvy.service.UsersService;

@RestController
public class ProductController {
	@Autowired
	ProductService service;
	
	@Autowired
	UsersService uService;
	
	@Autowired
	CartService cService;
	
//	@Autowired
//	Cart cart;
//	
	@PostMapping("/addProduct")
	public String addProduct(@RequestBody Product product) {
		return service.addProduct(product);
	}
	
    @GetMapping("/searchProduct")
    public ResponseEntity<?> searchProduct(@RequestParam long id) {
        // The service might throw ProductNotFoundException
        // but we don't need to catch it here thanks to the global handler
        Product product = service.searchProduct(id);
        return ResponseEntity.ok(product);
    }
	
//	@GetMapping("/searchProduct")
//	public Product searchProduct(@RequestParam String name) {
//		return service.searchProduct(name);
//	}
	
	@PostMapping("/updateProduct")
	public String updateProduct(@RequestBody Product product) {
		return service.updateProduct(product);
	}
	
	@GetMapping("/deleteProduct")
	public String deleteProduct(@RequestParam long id) {
		return service.deleteProduct(id);
	}
	
	@GetMapping("/getAllProducts")
	public List<Product> getAllProducts() {
		return service.getAllProducts();
	}	
	
//	@PostMapping("/addToCart")
//	public String addToCart(@RequestBody CartData data) {
//		System.out.println(data);
//	    Users user = uService.getUser(data.getUsername());
//	    Product product = service.searchProduct(data.getProductId());
//
//	    if (user == null || product == null) {
//	        return "User or product not found";
//	    }
//
//	    Cart cart = user.getCart();
//	    if (cart == null) {
//	        cart = new Cart();
//	        cart.setUser(user);
//	        List<Product> pList = new ArrayList<Product>();
//	        pList.add(product); 
//	        cart.setProductList(pList);
//	   
//	    } else {
//	    	cart = user.getCart();
//	    	cart.getProductList().add(product);
//	    }
//	   
//	    cService.addCart(cart);
//	    user.setCart(cart);
//	    // Link product <-> cart
//	    product.setCart(cart);
//
//	    // Save both sides
//	    service.saveProduct(product);   // ✅ update product.cart_id
//	    uService.saveUser(user);        // ✅ save cart mapping
//
//	    return "Product added to cart successfully!";
//	}
	
	@PostMapping("/addToCart")
	public String addToCart(@RequestBody CartData data) {
	    System.out.println("Adding to cart: " + data);
	    
	    Users user = uService.getUser(data.getUsername());
	    Product product = service.searchProduct(data.getProductId());

	    if (user == null || product == null) {
	        return "User or product not found";
	    }

	    // Get or create the user's cart
	    Cart cart = user.getCart();
	    if (cart == null) {
	        cart = new Cart();
	        cart.setUser(user);
	        user.setCart(cart);
	    }

	    // Use the new helper method to add the product with quantity
	    cart.addItem(product, data.getQuantity());

	    // Save the user (which will cascade and save the cart and its items)
	    uService.saveUser(user);
	    return "Product added to cart successfully!";
	}


	
}
