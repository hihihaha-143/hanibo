import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("hanibo_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Истёкший/отозванный токен должен разлогинить приложение, а не оставлять
// пользователя на странице с повторяющимися ошибками API.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (localStorage.getItem("hanibo_token")) {
        localStorage.removeItem("hanibo_token");
        window.dispatchEvent(new Event("hanibo:auth-expired"));
      }
    }
    return Promise.reject(error);
  },
);
