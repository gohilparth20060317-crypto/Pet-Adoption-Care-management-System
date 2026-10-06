package com.pms.PetManagementSystem.controller;

import com.pms.PetManagementSystem.model.AdoptionRequest;
import com.pms.PetManagementSystem.model.AdoptionStatus;
import com.pms.PetManagementSystem.service.AdoptionService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/adoption")
@CrossOrigin(origins = "*")
public class AdoptionController {

	@Autowired
	private AdoptionService adoptionService;

	@PostMapping("/request")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<AdoptionRequest> submitRequest(@RequestBody AdoptionRequest request) {

	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    String email = authentication.getName();

	    AdoptionRequest created = adoptionService.submitRequest(request, email);

	    return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@GetMapping("/history/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<AdoptionRequest>> getUserHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(adoptionService.getUserHistory(userId));
    }
	
	

	@PutMapping("/admin/status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdoptionRequest> updateStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        return ResponseEntity.ok(adoptionService.updateStatus(id, status));
    }
	
	
}
