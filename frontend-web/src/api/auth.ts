import { apiClient } from "./client";
import type { User } from "../types/user";

interface AuthResponse {
  user: User;
  token: string;
}

interface MeResponse {
  user: User;
}

export async function register(payload: {
  nickname: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );
  return data;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function me(): Promise<User> {
  const { data } = await apiClient.get<MeResponse>("/auth/me");
  return data.user;
}
