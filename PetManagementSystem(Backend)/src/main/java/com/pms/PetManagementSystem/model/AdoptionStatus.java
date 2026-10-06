package com.pms.PetManagementSystem.model;

public final class AdoptionStatus {
	private AdoptionStatus() {} // Prevent instantiation

    public static final String PENDING = "PENDING";
    public static final String APPROVED = "APPROVED";
    public static final String REJECTED = "REJECTED";
	public static String getPending() {
		return PENDING;
	}
	public static String getApproved() {
		return APPROVED;
	}
	public static String getRejected() {
		return REJECTED;
	}
	
	
	
}
