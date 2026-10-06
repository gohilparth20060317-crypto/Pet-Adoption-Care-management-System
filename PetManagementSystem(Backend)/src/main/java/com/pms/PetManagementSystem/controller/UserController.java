package com.pms.PetManagementSystem.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.pms.PetManagementSystem.DTO.LoginRequest;
import com.pms.PetManagementSystem.DTO.LoginResponse;
import com.pms.PetManagementSystem.DTO.UserDto;
import com.pms.PetManagementSystem.model.User;
import com.pms.PetManagementSystem.service.UserService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	UserService service;

	@PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = service.login(request);
        return ResponseEntity.ok(response);
    }
	
	@GetMapping("/me")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<User> getCurrentUser(Authentication authentication) {
	    String email = authentication.getName();
	    User user = service.getUserByEmail(email); // or userrepo.findByEmail(email)
	    return ResponseEntity.ok(user);
	}

	@GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
        String result = service.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", result));
    }

	@PostMapping("/add")
    public ResponseEntity<User> addUser(@Valid @RequestBody UserDto user) {
        User createdUser = service.addUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

	@GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = service.getAllUsers();
        return ResponseEntity.ok(users);
    }

	@GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = service.getUserById(id);
        return ResponseEntity.ok(user);
    }
	
	@PutMapping("/update/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@Valid @RequestBody UserDto userDto, @PathVariable Long id) {
        User updatedUser = service.updateUser(userDto, id);
        return ResponseEntity.ok(updatedUser);
    }

	@DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User Deleted Successfully"));
    }
}