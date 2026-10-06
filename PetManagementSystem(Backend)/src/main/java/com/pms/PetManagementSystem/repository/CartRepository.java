package com.pms.PetManagementSystem.repository;
import com.pms.PetManagementSystem.model.Cart;
import com.pms.PetManagementSystem.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
	
	
	
	Optional<Cart> findByUserIdAndPetId(Long userId, Long petId);


	List<Cart> findByUserId(Long userId);
}