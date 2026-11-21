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

interface ProfileResponse {
  user: User;
}

export interface SettingsPayload {
  daily_exp_goal?: number;
  timezone?: string;
}

export interface PasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
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

export async function logoutAll(): Promise<void> {
  await apiClient.post("/auth/logout-all");
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post("/auth/forgot-password", { email });
}

export async function resetPassword(payload: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}): Promise<void> {
  await apiClient.post("/auth/reset-password", payload);
}

export async function refreshToken(): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/refresh");
  return data;
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

export async function updateProfile(payload: {
  nickname: string;
  email: string;
}): Promise<User> {
  const { data } = await apiClient.patch<ProfileResponse>(
    "/auth/profile",
    payload,
  );
  return data.user;
}

export async function updateSettings(
  payload: SettingsPayload,
): Promise<TimezoneResponse> {
  const { data } = await apiClient.patch<TimezoneResponse>(
    "/auth/settings",
    payload,
  );
  return data;
}

export async function updatePassword(payload: PasswordPayload): Promise<void> {
  await apiClient.patch("/auth/password", payload);
}
