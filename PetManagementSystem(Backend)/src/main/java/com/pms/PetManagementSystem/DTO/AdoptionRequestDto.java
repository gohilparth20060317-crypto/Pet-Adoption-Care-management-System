package com.pms.PetManagementSystem.DTO;

public class AdoptionRequestDto {


    private Long userId;
    private Long petId;
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public Long getPetId() {
		return petId;
	}
	public void setPetId(Long petId) {
		this.petId = petId;
	}
    
    
}
