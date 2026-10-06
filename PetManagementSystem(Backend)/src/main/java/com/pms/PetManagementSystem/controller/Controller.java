package com.pms.PetManagementSystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.pms.PetManagementSystem.DTO.LoginRequest;
import com.pms.PetManagementSystem.DTO.LoginResponse;
import com.pms.PetManagementSystem.model.Pet;
import com.pms.PetManagementSystem.service.PetServiceImpl;

@RestController
@RequestMapping("/pet")
public class Controller {
	@Autowired
	PetServiceImpl petService;

	@PostMapping("/addPet")
	@PreAuthorize("hasRole('ADMIN')")
	public Pet addPet(@RequestBody Pet pet) {
		return petService.addPet(pet);

	}

	@GetMapping("/getAllPet")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public Page<Pet> getAllPet(Pageable pageable) {
		return petService.getAllPet(pageable);
	}

	@GetMapping("/getPet/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public Pet getPetById(@PathVariable Long id) {
		return petService.getPetById(id);
	}

	@PutMapping("/updatePet/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public Pet updatePet(@RequestBody Pet pet, @PathVariable Long id) {
		return petService.updatePet(id, pet);
	}

	@DeleteMapping("deletePet/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public String deletePet(@PathVariable Long id) {
		petService.deletePet(id);
		return "Employee Deleted Successfully";
	}

}
