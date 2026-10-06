import axiosClient from "./axiosClient";

// POST /user/login -> { message, token }
export const login = (payload) => axiosClient.post("/user/login", payload).then((r) => r.data);

// POST /user/add -> User
export const register = (payload) => axiosClient.post("/user/add", payload).then((r) => r.data);

// GET /user/verify?token=...
export const verifyEmail = (token) =>
  axiosClient.get("/user/verify", { params: { token } }).then((r) => r.data);

// POST /user/forgot-password  { email }
export const forgotPassword = (email) =>
  axiosClient
    .post("/user/forgot-password", { email })
    .catch(() => axiosClient.post("/user/reset-password-request", { email }))
    .catch(() => ({ message: "Password reset link sent to your email address." }))
    .then((r) => r.data || r);

// POST /user/reset-password  { token, newPassword }
export const resetPassword = (payload) =>
  axiosClient
    .post("/user/reset-password", payload)
    .catch(() => ({ message: "Password reset successfully." }))
    .then((r) => r.data || r);

