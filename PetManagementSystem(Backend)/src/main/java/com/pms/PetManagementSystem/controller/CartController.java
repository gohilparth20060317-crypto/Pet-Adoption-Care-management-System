package com.pms.PetManagementSystem.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pms.PetManagementSystem.DTO.CartRequest;
import com.pms.PetManagementSystem.model.Cart;
import com.pms.PetManagementSystem.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cart")
public class CartController
{
	@Autowired
	private CartService cartservice;
	
	@PostMapping("/addtocart")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Cart> addToCart(@Valid @RequestBody CartRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(cartservice.addToCart(request, email));
    }
	
	@GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Cart> getUserCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(cartservice.getCartByUserEmail(email));
    }

    // Clear cart after order completion
    @DeleteMapping("/clear")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> clearCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        cartservice.clearCart(email);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }
}