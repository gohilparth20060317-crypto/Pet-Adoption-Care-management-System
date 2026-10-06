package com.pms.PetManagementSystem.security;

import org.springframework.beans.factory.annotation.Autowired;

public class SecurityConfig {
	@Autowired
	private JwtAuthenticationFilter jwtauth;
	
}
