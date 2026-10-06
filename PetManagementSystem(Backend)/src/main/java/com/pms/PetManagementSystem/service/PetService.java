package com.pms.PetManagementSystem.service;



import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.pms.PetManagementSystem.model.Pet;

public interface PetService {
	Pet addPet(Pet pet);
	
	Page<Pet> getAllPet(Pageable pageable);

	Pet getPetById(Long id);
	
	Pet updatePet(Long id,Pet pet);
	
	void deletePet(Long id);

	Page<Pet> getPetsWithPaginationAndSearch(String keyword, int page, int size, String sortBy, String sortDir);

	void uploadPetImage(Long id, MultipartFile file);
}

	

	

	

	

	

	

	
	

	

	

	

