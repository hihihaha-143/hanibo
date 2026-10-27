import { createContext } from "react";
import type { User } from "../types/user";
import type { RefreshDailyResult } from "../api/auth";

export interface RegisterPayload {
  nickname: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshDaily: RefreshDailyResult | null;
  clearRefreshDaily: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
