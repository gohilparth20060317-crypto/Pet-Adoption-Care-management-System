import axiosClient from "./axiosClient";

// GET /api/categories
export const getCategories = () => axiosClient.get("/api/categories").then((r) => r.data);

// POST /api/categories (ADMIN)
export const addCategory = (category) =>
  axiosClient.post("/api/categories", category).then((r) => r.data);

// PUT /api/categories/{id} (ADMIN)
export const updateCategory = (id, category) =>
  axiosClient.put(`/api/categories/${id}`, category).then((r) => r.data);

// DELETE /api/categories/{id} (ADMIN)
export const deleteCategory = (id) =>
  axiosClient.delete(`/api/categories/${id}`).then((r) => r.data);
