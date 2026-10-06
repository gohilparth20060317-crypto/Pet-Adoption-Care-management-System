package com.pms.PetManagementSystem.controller;

import com.pms.PetManagementSystem.model.Pet;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.pms.PetManagementSystem.service.PetService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetController {

	@Autowired
	private PetService petService;

	@PostMapping("/addpet")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Pet> addPet(@Valid @RequestBody Pet pet) {
		Pet createdPet = petService.addPet(pet);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdPet);
	}

	@GetMapping("/getpets")
	public ResponseEntity<Page<Pet>> getAllPets(@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size) {
		PageRequest pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(petService.getAllPet(pageable));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Pet> updatePet(@PathVariable Long id, @Valid @RequestBody Pet pet) {
		return ResponseEntity.ok(petService.updatePet(id, pet));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Map<String, String>> deletePet(@PathVariable Long id) {
		petService.deletePet(id);
		return ResponseEntity.ok(Map.of("message", "Pet deleted successfully"));
	}

	

	@GetMapping("/search")
	public ResponseEntity<Page<Pet>> getPetsPagedAndSorted(
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "page", defaultValue = "0", required = false) int page,
			@RequestParam(value = "size", defaultValue = "8", required = false) int size,
			@RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
			@RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir) {

		// Safely map "id" to "petId" if your Pet entity field is named "petId"
		if ("id".equalsIgnoreCase(sortBy)) {
			sortBy = "id"; // Replace with your actual Pet.java field name
		}

		Page<Pet> petPage = petService.getPetsWithPaginationAndSearch(keyword, page, size, sortBy, sortDir);
		return ResponseEntity.ok(petPage);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
		Pet pet = petService.getPetById(id);
		return ResponseEntity.ok(pet);
	}

}
