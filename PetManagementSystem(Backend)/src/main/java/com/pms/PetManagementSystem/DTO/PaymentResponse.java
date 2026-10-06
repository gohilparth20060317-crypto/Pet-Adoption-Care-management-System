package com.pms.PetManagementSystem.DTO;

public class PaymentResponse {

	private String orderId;
	private Double amount;
	private String currency;

	public PaymentResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public PaymentResponse(String orderId, Double amount, String currency) {
		super();
		this.orderId = orderId;
		this.amount = amount;
		this.currency = currency;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

}
