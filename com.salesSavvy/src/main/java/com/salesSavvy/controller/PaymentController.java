 package com.salesSavvy.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/payment")
public class PaymentController {

    private static final String RAZORPAY_KEY_ID = "rzp_test_RGyL9I6McCuTtD";
    private static final String RAZORPAY_KEY_SECRET = "XqjpqbcpmKL8VPk5JXlsnkA6";

    @PostMapping("/create-order")
    public String createOrder(@RequestBody PaymentRequest paymentRequest) {
        try {
            RazorpayClient razorpay = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", paymentRequest.getAmount() * 100); // amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);
            
            Order order = razorpay.orders.create(orderRequest);
            return order.toString();
        } catch (RazorpayException e) {
            e.printStackTrace();
            return "{\"error\":\"Failed to create order\"}";
        }
    }

    @PostMapping("/verify-payment")
    public String verifyPayment(@RequestBody PaymentVerificationRequest verificationRequest) {
        // Implement payment verification logic here
        // This should verify the payment signature to ensure it's legitimate
        
        // For demo purposes, we'll just return success
        return "{\"status\":\"success\"}";
    }

    public static class PaymentRequest {
        private double amount;
        
        public double getAmount() {
            return amount;
        }
        
        public void setAmount(double amount) {
            this.amount = amount;
        }
    }

    public static class PaymentVerificationRequest {
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;
        
        // Getters and setters
        public String getRazorpayOrderId() { return razorpayOrderId; }
        public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
        
        public String getRazorpayPaymentId() { return razorpayPaymentId; }
        public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
        
        public String getRazorpaySignature() { return razorpaySignature; }
        public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }
    }
}
