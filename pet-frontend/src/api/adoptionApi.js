import axiosClient from "./axiosClient";



// GET /api/adoption/history/{userId}
export const getAdoptionHistory = (userId) =>
  axiosClient.get(`/api/adoption/history/${userId}`).then((r) => r.data);

// PUT /api/adoption/admin/status/{id}?status=
export const updateAdoptionStatus = (id, status) =>
  axiosClient
    .put(`/api/adoption/admin/status/${id}`, null, { params: { status } })
    .then((r) => r.data);

// POST /api/adoption/request (or your specific adoption endpoint)
export const submitAdoptionRequest = (petId, userId) => {
  const payload = {
    pet: {
      petId: petId
    },
    user: {
      id: userId // Make sure key matches your User entity primary key field
    }
  };

  return axiosClient.post("/api/adoption/request", payload).then((r) => r.data);
};

