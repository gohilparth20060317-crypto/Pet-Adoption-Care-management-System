import axiosClient from "./axiosClient";

// GET /payment/all (ADMIN)
export const getAllPayments = () => axiosClient.get("/payment/all").then((r) => r.data);

// POST /payment/create-order  { userId, amount, totalAmount, price, items }
export const createOrder = (userId, amount, items = []) =>
  axiosClient
    .post("/payment/create-order", {
      userId,
      amount,
      totalAmount: amount,
      price: amount,
      items: items.map((i) => ({ petId: i.pet?.petId || i.pet?.id, quantity: i.quantity, price: i.pet?.price })),
    })
    .then((r) => r.data);

// POST /payment/pay  { userId, razorPayOrderId, razorPayPaymentId }
export const confirmPayment = (payload) =>
  axiosClient.post("/payment/pay", payload).then((r) => r.data);

