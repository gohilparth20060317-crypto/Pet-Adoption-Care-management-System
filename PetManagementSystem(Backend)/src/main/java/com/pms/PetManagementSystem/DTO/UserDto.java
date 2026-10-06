package com.pms.PetManagementSystem.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserDto {
	
	@NotBlank(message = "Name cann not be blank")
	private String username;
	
	@NotBlank(message = "Name cann not be blank")	
	private String email;
	
	@Size(min = 10,max = 50,message = "Size must be Beetween 10 and 50")
	private String password;
	
	@Pattern(regexp = "^(ADMIN|USER)$", message = "Invalid role provided")
	private String role;
	
	
	
	
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	
	
	
	
	
	

}
