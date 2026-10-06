package com.pms.PetManagementSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.pms.PetManagementSystem.model.Pet;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    default // Search API support with Pagination and Sorting (Method Signature ONLY)
     Page<Pet> findByNameContainingIgnoreCaseOrBreedContainingIgnoreCase(String name, String breed, Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}

    // Filter by Category support
    @Query("SELECT p FROM Pet p WHERE p.category.id = :categoryId")
    Page<Pet> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

	void deleteById(Long id);
	
	@Query("SELECT p FROM Pet p WHERE p.id = :id")
	Optional<Pet> findById(@Param("id") Long id);
}