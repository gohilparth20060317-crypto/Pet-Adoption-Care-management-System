package com.pms.PetManagementSystem.DTO;

public class CartRequest 
{
   private Long petId;
   private Integer quantity;
   private Integer userId;
   
   
   
   public Integer getUserId() {
	return userId;
}
   public void setUserId(Integer userId) {
	this.userId = userId;
   }
   public Long getPetId() {
	return petId;
   }
   public void setPetId(Long petId) {
	this.petId = petId;
   }
   public Integer getQuantity() {
	return quantity;
   }
   public void setQuantity(Integer quantity) {
	this.quantity = quantity;
   }
  
   public CartRequest(Long petId, Integer quantity, Integer userId) {
	super();
	this.petId = petId;
	this.quantity = quantity;
	this.userId = userId;
}
   public CartRequest() {
	super();
	// TODO Auto-generated constructor stub
   }
   
   
   
   
}