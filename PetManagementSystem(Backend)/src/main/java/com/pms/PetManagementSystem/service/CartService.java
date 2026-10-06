package com.pms.PetManagementSystem.service;

import com.pms.PetManagementSystem.DTO.CartRequest;


import com.pms.PetManagementSystem.model.Cart;

public interface CartService {
	
	//Add items
	Cart addToCart(CartRequest request, String email);
	
	Cart getCartByUserEmail(String email);
    void clearCart(String email);
}
