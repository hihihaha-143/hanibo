import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../config/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("hanibo_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ token: string; user: unknown }>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true, timeout: 10000 },
      )
      .then(({ data }) => {
        localStorage.setItem("hanibo_token", data.token);
        window.dispatchEvent(
          new CustomEvent("hanibo:user-updated", { detail: data.user }),
        );
        return data.token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const config = error.config as RetryConfig;
    const url = config.url ?? "";
    const isAuthRefresh = url.includes("/auth/refresh");
    const isLogin = url.includes("/auth/login") || url.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      !config._retry &&
      !isAuthRefresh &&
      !isLogin &&
      localStorage.getItem("hanibo_token")
    ) {
      config._retry = true;

      try {
        const token = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        return apiClient(config);
      } catch {
        // Fall through to logout below.
      }
    }

    if (
      error.response?.status === 401 &&
      localStorage.getItem("hanibo_token")
    ) {
      localStorage.removeItem("hanibo_token");
      window.dispatchEvent(new Event("hanibo:auth-expired"));
    }

    return Promise.reject(error);
  },
);
