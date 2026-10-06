package com.pms.PetManagementSystem.DTO;

public class PaymentSuccessRequest {
	
	private Long userId;
	private String razorPayOrderId;
	private String razorPayPaymentId;
	
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getRazorPayOrderId() {
		return razorPayOrderId;
	}
	public void setRazorPayOrderId(String razorPayOrderId) {
		this.razorPayOrderId = razorPayOrderId;
	}
	public String getRazorPayPaymentId() {
		return razorPayPaymentId;
	}
	public void setRazorPayPaymentId(String razorPayPaymentId) {
		this.razorPayPaymentId = razorPayPaymentId;
	}
	
	
	

}
