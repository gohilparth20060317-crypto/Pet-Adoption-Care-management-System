package com.pms.PetManagementSystem.controller;

import java.util.List;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pms.PetManagementSystem.DTO.PaymentRequest;
import com.pms.PetManagementSystem.DTO.PaymentResponse;
import com.pms.PetManagementSystem.DTO.PaymentSuccessRequest;
import com.pms.PetManagementSystem.model.Payment;
import com.pms.PetManagementSystem.service.PaymentServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/payment")
public class PaymentController {

	@Autowired
	private PaymentServiceImpl paymentservice;

	@PostMapping("/create-order")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> createOrder( @RequestBody  PaymentRequest request) throws Exception {
        return ResponseEntity.ok(paymentservice.createOrder(request));
    }

	@PostMapping("/pay")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> paymentSuccess(@Valid @RequestBody PaymentSuccessRequest request) {
        String result = paymentservice.PaymentSuccess(request);
        return ResponseEntity.ok(Map.of("message", result));
    }
	
	@GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentservice.getAllPayments());
    }
}
