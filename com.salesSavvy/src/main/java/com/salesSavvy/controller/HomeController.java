package com.salesSavvy.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public String home() {
        return "SalesSavvy API is running!";
    }
    
    @GetMapping("/test")
    public String test() {
        return "API test endpoint is working!";
    }
}