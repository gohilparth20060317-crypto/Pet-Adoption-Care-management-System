package com.pms.PetManagementSystem.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pms.PetManagementSystem.DTO.LoginRequest;
import com.pms.PetManagementSystem.DTO.LoginResponse;
import com.pms.PetManagementSystem.DTO.UserDto;
import com.pms.PetManagementSystem.model.Role; // Imported the Role constant
import com.pms.PetManagementSystem.model.User;
import com.pms.PetManagementSystem.model.VerificationToken;
import com.pms.PetManagementSystem.repository.UserRepository;
import com.pms.PetManagementSystem.repository.VerificationTokenRepo;
import com.pms.PetManagementSystem.security.JwtService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository repo;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private VerificationTokenRepo verificationtokenrepo;
    
    @Autowired
    private EmailService emailservice;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return user;
    }
    
    @Override
    public User addUser(UserDto dto) {
        User user = new User();
        
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        // 1. Assign role using the constant. 
        // Optional: If you want to allow users to register as ADMIN via the DTO, check dto.getRole() here.
        if (dto.getRole() != null && !dto.getRole().isBlank()) {
            user.setRole(Role.valueOf(dto.getRole().trim().toUpperCase()));
        } else {
            user.setRole(Role.USER);
        } 
        
        user.setEnabled(false);
        
        User saveduser = repo.save(user);
        
        // Token Generation & Email Verification
        String token = UUID.randomUUID().toString();
        VerificationToken verificationtoken = new VerificationToken();
        verificationtoken.setToken(token);
        verificationtoken.setExpirydate(LocalDateTime.now().plusMinutes(30));
        verificationtoken.setUser(saveduser);
        
        verificationtokenrepo.save(verificationtoken);
        emailservice.sendVerificationEmail(saveduser.getEmail(), token);
        
        return saveduser;
    }

    @Override
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    @Override
    public User getUserById(Long id) {
        Optional<User> user = repo.findById(id);
        return user.orElse(null);
    }
    @Override
    public User updateUser(UserDto userDto, Long id) { // 2. Swapped to UserDto for safety
        Optional<User> user1 = repo.findById(id);

        if (user1.isPresent()) {
            User u = user1.get();

            // 3. Only update fields if they are provided, and DO NOT allow role updates here.
            if (userDto.getUsername() != null && !userDto.getUsername().isEmpty()) {
                u.setUsername(userDto.getUsername());
            }
            if (userDto.getEmail() != null && !userDto.getEmail().isEmpty()) {
                u.setEmail(userDto.getEmail());
            }
            if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                // Encode the password before saving!
                u.setPassword(passwordEncoder.encode(userDto.getPassword()));
            }

            return repo.save(u);
        } else {
            return null;
        }
    }

    @Override
    public void deleteUser(Long id) {
        repo.deleteById(id);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Optional<User> optionalUser = repo.findByEmail(request.getEmail());
        if(optionalUser.isEmpty()) {
            return new LoginResponse("Invalid Email");
        }
        
        User user = optionalUser.get();
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse("Invalid Password");
        }
        
        if(!user.isEnabled()) {
            return new LoginResponse("Please verify your email first.", null);
        }
        
        String token = jwtService.generateToken(user);
        return new LoginResponse("Login Sucessful", token);
    }

    @Override
    public String verifyEmail(String token) {
        Optional<VerificationToken> optionaltoken = verificationtokenrepo.findByToken(token);
        
        if(optionaltoken.isEmpty()) {
            return "Invalid token";
        }
        
        VerificationToken verificationtoken = optionaltoken.get();
        
        if(verificationtoken.getExpirydate().isBefore(LocalDateTime.now())) {
            verificationtokenrepo.delete(verificationtoken);
            return "Verification token is expired";
        }
        
        User user = verificationtoken.getUser();
        user.setEnabled(true);
        repo.save(user);
        
        verificationtokenrepo.delete(verificationtoken);
        
        return "Email verified Successfull";
    }

	@Override
	public User getUserByEmail(String email) {
		return repo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
	}

	
}