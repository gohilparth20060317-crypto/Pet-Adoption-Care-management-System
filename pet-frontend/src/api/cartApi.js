import axiosClient from "./axiosClient";

// POST /cart/addtocart  { petId, quantity }
export const addToCart = (petId, quantity = 1) =>
  axiosClient.post("/cart/addtocart", { petId, quantity }).then((r) => r.data);

// DELETE /cart/clear or POST /cart/clear
export const clearServerCart = (userId) =>
  axiosClient
    .delete(`/cart/clear/${userId}`)
    .catch(() => axiosClient.delete("/cart/clear"))
    .catch(() => axiosClient.post("/cart/clear", { userId }))
    .catch(() => null);

// DELETE /cart/remove/{petId} or POST /cart/remove
export const removeFromCart = (petId) =>
  axiosClient
    .delete(`/cart/remove/${petId}`)
    .catch(() => axiosClient.post("/cart/remove", { petId }))
    .catch(() => null);

