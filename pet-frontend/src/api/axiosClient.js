import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every outgoing request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("pms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses & handle expired/invalid sessions
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("pms_token");
      localStorage.removeItem("pms_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?sessionExpired=1";
      }
    }
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      (typeof error?.response?.data === "string" ? error.response.data : null) ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject({ status, message, raw: error });
  }
);

export default axiosClient;
