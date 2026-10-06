package com.pms.PetManagementSystem.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.PetManagementSystem.DTO.CartRequest;
import com.pms.PetManagementSystem.model.Cart;
import com.pms.PetManagementSystem.model.Pet;
import com.pms.PetManagementSystem.model.User;
import com.pms.PetManagementSystem.repository.CartRepository;
import com.pms.PetManagementSystem.repository.PetRepository;
import com.pms.PetManagementSystem.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CartServiceImpl implements CartService {

	@Autowired
	private CartRepository cartrepo;

	@Autowired
	private UserRepository userrepo;

	@Autowired
	private PetRepository petrepo;

	// Adding to cart
	@Transactional
	@Override
	public Cart addToCart(CartRequest request, String email) {
	    User user = userrepo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

	    Pet pet = petrepo.findById(request.getPetId())
	            .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + request.getPetId()));

	    // 1. Fetch existing cart entry
	    
		Optional<Cart> existingCart = cartrepo.findByUserIdAndPetId(user.getId(), request.getPetId());

	    if (existingCart.isPresent()) {
	        // 2. If it exists, update the quantity
	        Cart cart = existingCart.get();
	        cart.setQuantity(cart.getQuantity() + request.getQuantity());
	        return cartrepo.save(cart); // Performs UPDATE
	    } else {
	        // 3. Otherwise, create a new cart entry
	        Cart cart = new Cart();
	        cart.setUser(user);         // or userId depending on your Entity definition
	        cart.setPet(pet);           // or petId
	        cart.setQuantity(request.getQuantity());
	        return cartrepo.save(cart); // Performs INSERT
	    }
	}
	@Override
	public Cart getCartByUserEmail(String email) {
		User user = userrepo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
	    
	    List<Cart> carts = cartrepo.findByUserId(user.getId()); // or cartrepo.findByUser(user)
	    
	    if (!carts.isEmpty()) {
	        return carts.get(0);
	    }
	    
	    Cart newCart = new Cart();
	    newCart.setUser(user);
	    return cartrepo.save(newCart);
	}

	@Override
	public void clearCart(String email) {
		User user = userrepo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

	    List<Cart> userCarts = cartrepo.findByUserId(user.getId());
	    
	    if (!userCarts.isEmpty()) {
	        cartrepo.deleteAll(userCarts);
	    }
	}

}