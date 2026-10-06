package com.pms.PetManagementSystem.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="pet")
public class Pet
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pet_id")
	private Long id;
	private String name;
	private String species;
	private int age;
	private Double price;
	
	
	// If you have adoption requests or cart items listed inside Pet:
	@OneToMany(mappedBy = "pet")
	@JsonIgnore // Prevents circular JSON serialization errors
	private List<Cart> cartItems;
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Cart> getCartItems() {
		return cartItems;
	}

	public void setCartItems(List<Cart> cartItems) {
		this.cartItems = cartItems;
	}
	@ManyToOne
	@JoinColumn(name = "category_id")
	@JsonBackReference
	private Category category;

	// Add getter and setter for category
	public Category getCategory() {
	    return category;
	}

	public void setCategory(Category category) {
	    this.category = category;
	}
	
	
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public Pet() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Pet(String name, String species, int age, Double price) {
		super();
		
		this.name = name;
		this.species = species;
		this.age = age;
		this.price = price;
	}
	public Long getPetId() {
		return id;
	}
	
	public void setPetId(Long id) {
		this.id = id;
	}
	
	public String getSpecies() {
		return species;
	}
	public void setSpecies(String species) {
		this.species = species;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}

	
		

}
