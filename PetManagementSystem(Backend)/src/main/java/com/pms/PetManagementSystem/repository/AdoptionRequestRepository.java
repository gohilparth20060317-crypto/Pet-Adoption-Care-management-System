package com.pms.PetManagementSystem.repository;

import com.pms.PetManagementSystem.model.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long>{

	List<AdoptionRequest> findByUserId(Long userId);
}
