// Substitua o arquivo frontend/src/services/api.js por este.
//
// Antes o baseURL estava fixo em "http://127.0.0.1:8000/api/", o que só
// funciona rodando tudo na sua máquina. Em produção (dentro do cluster,
// atrás do Traefik) o frontend e o backend são acessados pelo MESMO host,
// então a chamada deve ser relativa: "/api/". O Traefik cuida de rotear
// pra dentro do Service certo.
//
// Em dev local (npm run dev) o Vite lê o .env.development e usa o backend
// direto na porta 8000. Em build de produção (npm run build) o Vite lê o
// .env.production e usa o caminho relativo.
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/",
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
