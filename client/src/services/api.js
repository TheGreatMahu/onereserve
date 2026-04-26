import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("or_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong.";

    if (status === 401) {
      localStorage.removeItem("or_token");
      localStorage.removeItem("or_user");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    } else if (status === 403) {
      toast.error("You don't have permission to do that.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject({ message, status });
  }
);

export default api;