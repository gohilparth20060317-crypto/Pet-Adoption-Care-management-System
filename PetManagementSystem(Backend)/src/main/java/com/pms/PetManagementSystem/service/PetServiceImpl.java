package com.pms.PetManagementSystem.service;

import java.util.List;

import java.util.Optional;
import org.springframework.data.domain.PageRequest;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.io.IOException;

import com.pms.PetManagementSystem.model.Pet;
import com.pms.PetManagementSystem.repository.PetRepository;

@Service
public class PetServiceImpl implements PetService {
	@Autowired
	PetRepository repo;

	@Override
	public Pet addPet(Pet pet) {
		// TODO Auto-generated method stub
		return repo.save(pet);
	}

	@Override
	public Page<Pet> getAllPet(Pageable pageable) {

		return repo.findAll(pageable);
	}

	@Override
	public Pet getPetById(Long id) {
		Optional<Pet> pet = repo.findById(id);
		if (pet.isPresent()) {
			return pet.get();
		} else {
			return null;
		}
	}

	@Override
	public void deletePet(Long id) {
		repo.deleteById(id);

	}

	public Page<Pet> getPetsWithPaginationAndSearch(String keyword, int page, int size, String sortBy, String sortDir) {

		Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
	    Pageable pageable = PageRequest.of(page, size, sort);

	    // Treat empty or blank search string as null
	    if (keyword != null && keyword.trim().isEmpty()) {
	        keyword = null;
	    }

	    if (keyword == null) {
	        return repo.findAll(pageable);
	    }

	    return repo.findByNameContainingIgnoreCaseOrBreedContainingIgnoreCase(keyword, keyword, pageable);
	}

	@Override
	public Pet updatePet(Long id, Pet pet) {
		Optional<Pet> pet1 = repo.findById(id);
		if (pet1.isPresent()) {
			Pet p = pet1.get();
			p.setName(pet.getName());
			p.setSpecies(pet.getSpecies());
			p.setAge(pet.getAge());

			return repo.save(p);
		} else {
			return null;
		}

	}

	@Override
	public void uploadPetImage(Long id, MultipartFile file) {

		try {
			// 1. Find the pet in the database (Converting Long to int based on your
			// repository setup)
			Optional<Pet> optionalPet = repo.findById((long) id.intValue());

			if (optionalPet.isPresent()) {
				Pet pet = optionalPet.get();

				// 2. Define the directory where images will be saved
				String uploadDir = "uploads/pets/";
				java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);

				// Create the directory if it doesn't exist
				if (!java.nio.file.Files.exists(uploadPath)) {
					java.nio.file.Files.createDirectories(uploadPath);
				}

				// 3. Generate a unique file name to prevent overwriting images with the same
				// name
				String fileName = java.util.UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
				java.nio.file.Path filePath = uploadPath.resolve(fileName);

				// 4. Copy the file to the target location
				java.nio.file.Files.copy(file.getInputStream(), filePath,
						java.nio.file.StandardCopyOption.REPLACE_EXISTING);

				// 5. Update the Pet entity with the image path and save to the database
				
			} else {
				throw new RuntimeException("Pet not found with ID: " + id);
			}
		} catch (java.io.IOException e) {
			throw new RuntimeException("Could not store the file. Error: " + e.getMessage(), e);
		}
	}
	
	

	

}
