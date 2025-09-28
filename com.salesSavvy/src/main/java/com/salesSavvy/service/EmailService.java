package com.salesSavvy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("SalesSavvy - Password Reset OTP");
            
            String emailContent = String.format(
                "Dear User,\n\n" +
                "Your One-Time Password (OTP) for password reset is: %s\n\n" +
                "This OTP is valid for 10 minutes. Please do not share this OTP with anyone.\n\n" +
                "If you did not request this reset, please ignore this email.\n\n" +
                "Best regards,\nSalesSavvy Team",
                otp
            );
            
            message.setText(emailContent);
            mailSender.send(message);
            System.out.println("OTP email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}