package com.pms.PetManagementSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
	
	@Autowired
	private JavaMailSender mailsender;
	
	public void sendVerificationEmail(String toEmail, String token) {
		
		String subject = "Email Verification";
		
		String body = "Hello , \n\n" + "Thank you for Registrating.. \n\n" + "Click the link given below to verify your email\n\n" + "http://localhost:8080/user/verify?token="+token+"\n\n This link is valid for next 30 minutes only..";
		
		SimpleMailMessage message = new SimpleMailMessage();
		
		message.setTo(toEmail);
		message.setSubject(subject);
		message.setText(body);
		mailsender.send(message);
	}
}
