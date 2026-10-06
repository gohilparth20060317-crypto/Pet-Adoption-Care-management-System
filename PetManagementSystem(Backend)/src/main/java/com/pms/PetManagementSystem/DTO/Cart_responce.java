package com.pms.PetManagementSystem.DTO;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Cart_responce {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cart_id;
	private int pet_id;
	private String petName;
	private double pet_Price;
	private int quantity;
	private double total_price;
	
	public Long getCart_id() {
		return cart_id;
	}
	public void setCart_id(Long cart_id) {
		this.cart_id = cart_id;
	}
	public int getPet_id() {
		return pet_id;
	}
	public void setPet_id(int pet_id) {
		this.pet_id = pet_id;
	}
	public String getPetName() {
		return petName;
	}
	public void setPetName(String petName) {
		this.petName = petName;
	}
	public double getPet_Price() {
		return pet_Price;
	}
	public void setPet_Price(double pet_Price) {
		this.pet_Price = pet_Price;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public double getTotal_price() {
		return total_price;
	}
	public void setTotal_price(double total_price) {
		this.total_price = total_price;
	}
	
	public Cart_responce(Long cart_id, int pet_id, String petName, double pet_Price, int quantity,
			double total_price) {
		super();
		this.cart_id = cart_id;
		this.pet_id = pet_id;
		this.petName = petName;
		this.pet_Price = pet_Price;
		this.quantity = quantity;
		this.total_price = total_price;
	}
	public Cart_responce() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	

}
