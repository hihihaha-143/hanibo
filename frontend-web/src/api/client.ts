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
