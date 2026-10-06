package com.pms.PetManagementSystem.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.razorpay.RazorpayClient;

@Configuration
public class RazorpayConfig {

	@Value("${razorpay.key.id}")
	private String key;
	
	@Value("${razorpay.key.secret}")
	private String secret;
	
	@Bean
	public RazorpayClient razorpayclient() throws Exception{
		
		return new RazorpayClient(key, secret);
	}

	private RazorpayClient RazorpayClient(String key2, String secret2) {
		// TODO Auto-generated method stub
		return null;
	}

	
	
}
