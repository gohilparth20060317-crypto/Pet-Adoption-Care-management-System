package com.pms.PetManagementSystem.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestParam;

import com.pms.PetManagementSystem.DTO.LoginRequest;
import com.pms.PetManagementSystem.DTO.LoginResponse;
import com.pms.PetManagementSystem.DTO.UserDto;
import com.pms.PetManagementSystem.model.User;

public interface UserService {

    User addUser(UserDto user);

    List<User> getAllUsers();

    User getUserById(Long id);

   

    void deleteUser(Long id);
    
    LoginResponse  login(LoginRequest request);
    
    public String verifyEmail(String token);

	UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;

	User updateUser(UserDto userDto, Long id);
	
	User getUserByEmail(String email);

}