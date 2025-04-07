// Pastikan axiosConfig.js sudah benar
import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-book-alpha.vercel.app/api",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]; // Biarkan browser set otomatis
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Anda mungkin ingin menggunakan router untuk redirect
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
