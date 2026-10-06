package com.pms.PetManagementSystem.service;

import com.pms.PetManagementSystem.model.AdoptionRequest;
import com.pms.PetManagementSystem.model.AdoptionStatus;
import com.pms.PetManagementSystem.model.Pet;
import com.pms.PetManagementSystem.model.User;
import com.pms.PetManagementSystem.repository.AdoptionRequestRepository;
import com.pms.PetManagementSystem.repository.PetRepository;
import com.pms.PetManagementSystem.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class AdoptionService {

	@Autowired
	private AdoptionRequestRepository adoptionRepository;

	@Autowired
	private PetRepository petRepository;
	
	@Autowired
    private UserRepository userRepository;
	

	public AdoptionRequest submitRequest(AdoptionRequest request, String email) {

		System.out.println("Request = " + request);
	    System.out.println("Pet = " + request.getPet());

	    if (request.getPet() != null) {
	        System.out.println("Pet ID = " + request.getPet().getPetId());
	    }

	    if (request.getPet() == null || request.getPet().getPetId() == null) {
	        throw new RuntimeException("Pet ID must be provided");
	    }

	    Pet pet = petRepository.findById(request.getPet().getPetId())
	            .orElseThrow(() -> new RuntimeException("Pet not found"));

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    request.setPet(pet);
	    request.setUser(user);
	    request.setStatus("PENDING");
	    request.setRequestDate(new Date());

	    return adoptionRepository.save(request);
	}
	public List<AdoptionRequest> getUserHistory(Long userId) {
		return adoptionRepository.findByUserId(userId);
	}

	public AdoptionRequest updateStatus(Long id, String status) {
		AdoptionRequest request = adoptionRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Request not found"));
		request.setStatus(status);
		return adoptionRepository.save(request);
	}
}
