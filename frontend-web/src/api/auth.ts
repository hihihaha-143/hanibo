import { apiClient } from "./client";
import type { User } from "../types/user";

export interface RefreshDailyResult {
  freeze_used: boolean;
  freezes_used: number;
  streak_reset: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
  refresh_daily: RefreshDailyResult;
}

interface MeResponse {
  user: User;
  refresh_daily: RefreshDailyResult;
}

interface TimezoneResponse {
  user: User;
  refresh_daily: RefreshDailyResult;
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

export async function me(): Promise<MeResponse> {
  const { data } = await apiClient.get<MeResponse>("/auth/me");
  return data;
}

export async function updateTimezone(
  timezone: string,
): Promise<TimezoneResponse> {
  const { data } = await apiClient.post<TimezoneResponse>("/auth/timezone", {
    timezone,
  });
  return data;
}
