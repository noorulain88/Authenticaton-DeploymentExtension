import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("learnhub_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && localStorage.getItem("learnhub_token")) {
      // Keep the token so the user can read the error and choose to sign in again.
    }
    return Promise.reject(error);
  }
);

export const errorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Request failed. Please try again.";

export default api;
