import axiosClient from "./axiosClient";

// GET /user/me - resolves the currently authenticated user's full profile
export const getMe = () => axiosClient.get("/user/me").then((r) => r.data);

// GET /user/all (ADMIN)
export const getAllUsers = () => axiosClient.get("/user/all").then((r) => r.data);

// GET /user/{id}
export const getUserById = (id) => axiosClient.get(`/user/${id}`).then((r) => r.data);

// PUT /user/update/{id}
export const updateUser = (id, payload) =>
  axiosClient.put(`/user/update/${id}`, payload).then((r) => r.data);

// DELETE /user/delete/{id} (ADMIN)
export const deleteUser = (id) => axiosClient.delete(`/user/delete/${id}`).then((r) => r.data);
