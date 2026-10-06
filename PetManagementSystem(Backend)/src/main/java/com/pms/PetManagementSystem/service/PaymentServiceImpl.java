package com.pms.PetManagementSystem.service;

import java.time.LocalDateTime;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.PetManagementSystem.DTO.PaymentRequest;
import com.pms.PetManagementSystem.DTO.PaymentResponse;
import com.pms.PetManagementSystem.DTO.PaymentSuccessRequest;
import com.pms.PetManagementSystem.model.AdoptionRequest;
import com.pms.PetManagementSystem.model.Cart;
import com.pms.PetManagementSystem.model.Payment;
import com.pms.PetManagementSystem.model.User;
import com.pms.PetManagementSystem.repository.CartRepository;
import com.pms.PetManagementSystem.repository.PaymentRepository;
import com.pms.PetManagementSystem.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Service
public class PaymentServiceImpl {

	@Autowired
	private PaymentRepository paymentrepo;

	@Autowired
	private RazorpayClient razorpayclient;

	@Autowired
	private CartRepository cartrepo;

	@Autowired
	private UserRepository userrepo;
	
	public List<Payment> getAllPayments() {
	    return paymentrepo.findAll();
	}

	public PaymentResponse createOrder(PaymentRequest request) throws Exception {

		List<Cart> cartitems = cartrepo.findByUserId(request.getUserId());
		double totalamount = 0;

		for (Cart cart : cartitems) {

			totalamount += cart.getPet().getPrice() * cart.getQuantity();
		}
		JSONObject orderrequest = new JSONObject();

		orderrequest.put("amount", (int) totalamount * 100);
		orderrequest.put("currency", "INR");
		orderrequest.put("receipt", "receipt" + System.currentTimeMillis());

		Order order = razorpayclient.orders.create(orderrequest);

		return new PaymentResponse(order.get("id"), totalamount, order.get("currency"));
	}

	public String PaymentSuccess(PaymentSuccessRequest request) {

		User user = userrepo.findById(Long.valueOf(request.getUserId())).orElseThrow();

		List<Cart> cartitems = cartrepo.findByUserId(request.getUserId());
		double totalamount = 0;

		for (Cart cart : cartitems) {

			totalamount += cart.getPet().getPrice() * cart.getQuantity();
		}

		Payment payment = new Payment();

		payment.setUser(user);
		payment.setAmount(totalamount);
		payment.setRazorpayOrderId(request.getRazorPayOrderId());
		payment.setRazorpayId(request.getRazorPayPaymentId());
		payment.setStatus("Success");
		payment.setPaymentdate(LocalDateTime.now());

		paymentrepo.save(payment);

		cartrepo.deleteAll(cartitems);

		return "Payment Successfull";

	}
	
	// One Payment -> One Adoption Request
    @OneToOne
    @JoinColumn(name = "adoption_request_id")
    private AdoptionService adoptionRequest;

	public AdoptionService getAdoptionRequest() {
		return adoptionRequest;
	}

	public void setAdoptionRequest(AdoptionService adoptionRequest) {
		this.adoptionRequest = adoptionRequest;
	}
    

   
	

}
