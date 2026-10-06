package com.pms.PetManagementSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pms.PetManagementSystem.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>{

}
