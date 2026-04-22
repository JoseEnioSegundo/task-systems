import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authStore = useAuthStore();
      const success = await authStore.refreshToken();

      if (success) {
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${authStore.token}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;