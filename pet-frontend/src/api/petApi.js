import axiosClient from "./axiosClient";

// GET /api/pets/{id}
export const getPetById = (id) => axiosClient.get(`/api/pets/${id}`).then((r) => r.data);

// GET /api/pets/getpets?page=&size=
export const getPets = (page = 0, size = 10) =>
  axiosClient.get("/api/pets/getpets", { params: { page, size } }).then((r) => r.data);

// GET /api/pets/search?keyword=&page=&size=&sortBy=&sortDir=
export const searchPets = ({ keyword = "", page = 0, size = 10, sortBy = "id", sortDir = "asc" } = {}) =>
  axiosClient
    .get("/api/pets/search", { params: { keyword, page, size, sortBy, sortDir } })
    .then((r) => r.data);

// POST /api/pets (ADMIN)
export const addPet = (pet) => axiosClient.post("/api/pets/addpet", pet).then((r) => r.data);

// PUT /api/pets/{id} (ADMIN)
export const updatePet = (id, pet) => axiosClient.put(`/api/pets/${id}`, pet).then((r) => r.data);

// DELETE /api/pets/{id} (ADMIN)
export const deletePet = (id) => axiosClient.delete(`/api/pets/${id}`).then((r) => r.data);

// POST /api/pets/{id}/image (ADMIN) - multipart/form-data
export const uploadPetImage = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient
    .post(`/api/pets/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
