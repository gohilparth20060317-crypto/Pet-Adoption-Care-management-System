package com.pms.PetManagementSystem.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pms.PetManagementSystem.model.User;
import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Long> 
{
	Optional<User>  findByEmail(String email);

	Optional<User> findByUsername(String username);
}
