import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/user";
import {
  AuthContext,
  type LoginPayload,
  type RegisterPayload,
} from "./AuthContext";
import * as authApi from "../api/auth";
import type { RefreshDailyResult } from "../api/auth";

const TOKEN_KEY = "hanibo_token";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshDaily, setRefreshDaily] = useState<RefreshDailyResult | null>(
    null,
  );

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then(({ user: u, refresh_daily }) => {
        setUser(u);
        setRefreshDaily(refresh_daily);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { user: u, token, refresh_daily } = await authApi.login(payload);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    setRefreshDaily(refresh_daily);
    return u;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user: u, token, refresh_daily } = await authApi.register(payload);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    setRefreshDaily(refresh_daily);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setRefreshDaily(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { user: u, refresh_daily } = await authApi.me();
      setUser(u);
      if (refresh_daily.freeze_used || refresh_daily.streak_reset) {
        setRefreshDaily(refresh_daily);
      }
    } catch {
      // ignore
    }
  }, []);

  const clearRefreshDaily = useCallback(() => {
    setRefreshDaily(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      refreshDaily,
      clearRefreshDaily,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      refreshDaily,
      clearRefreshDaily,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
