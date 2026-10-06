package com.pms.PetManagementSystem.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "adoption_request")
public class AdoptionRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// One User -> Many Adoption Requests (This is the Many side)
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "pet_id")
	private Pet pet;

	private String status= AdoptionStatus.PENDING; // e.g., PENDING, APPROVED, REJECTED
	private Date requestDate;

	// One Payment -> One Adoption Request
	@OneToOne(mappedBy = "adoptionRequest")
	private Payment payment;
	

	

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Pet getPet() {
		return pet;
	}

	public void setPet(Pet pet) {
		this.pet = pet;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getRequestDate() {
		return requestDate;
	}

	public void setRequestDate(Date requestDate) {
		this.requestDate = requestDate;
	}

	public Payment getPayment() {
		return payment;
	}

	public void setPayment(Payment payment) {
		this.payment = payment;
	}
}
