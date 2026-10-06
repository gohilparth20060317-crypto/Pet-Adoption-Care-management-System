package com.pms.PetManagementSystem.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pms.PetManagementSystem.model.VerificationToken;


@Repository
public interface VerificationTokenRepo extends JpaRepository<VerificationToken, Long>{

	Optional<VerificationToken> findByToken(String token);
}
