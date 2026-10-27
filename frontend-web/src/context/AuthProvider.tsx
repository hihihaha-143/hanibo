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

function getBrowserTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || null;
  } catch {
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshDaily, setRefreshDaily] = useState<RefreshDailyResult | null>(
    null,
  );

  const syncTimezone = useCallback(async (u: User) => {
    const browserTz = getBrowserTimezone();
    if (!browserTz) return u;
    if (u.timezone === browserTz) return u;

    try {
      const { user: updated, refresh_daily } =
        await authApi.updateTimezone(browserTz);
      setRefreshDaily(refresh_daily);
      return updated;
    } catch {
      return u;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then(async ({ user: u, refresh_daily }) => {
        const synced = await syncTimezone(u);
        setUser(synced);
        setRefreshDaily(refresh_daily);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [syncTimezone]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { user: u, token, refresh_daily } = await authApi.login(payload);
      localStorage.setItem(TOKEN_KEY, token);
      const synced = await syncTimezone(u);
      setUser(synced);
      setRefreshDaily(refresh_daily);
      return synced;
    },
    [syncTimezone],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const { user: u, token, refresh_daily } = await authApi.register(payload);
      localStorage.setItem(TOKEN_KEY, token);
      const synced = await syncTimezone(u);
      setUser(synced);
      setRefreshDaily(refresh_daily);
      return synced;
    },
    [syncTimezone],
  );

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
      const synced = await syncTimezone(u);
      setUser(synced);
      if (refresh_daily.freeze_used || refresh_daily.streak_reset) {
        setRefreshDaily(refresh_daily);
      }
    } catch {
      // ignore
    }
  }, [syncTimezone]);

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
