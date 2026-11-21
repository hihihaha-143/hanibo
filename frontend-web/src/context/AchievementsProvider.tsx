import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getAchievements, syncAchievements } from "../api/achievements";
import type { AchievementCategory } from "../api/achievements";
import type { UnlockedAchievement } from "../api/alphabet";
import { useAuth } from "./useAuth";
import {
  AchievementContext,
  type AchievementSyncExtra,
} from "./AchievementContext";
import { collectAchievementStats } from "../lib/achievementStats";
import AchievementUnlockModal from "../components/AchievementUnlockModal/AchievementUnlockModal";

interface AchievementsProviderProps {
  children: ReactNode;
}

export function AchievementsProvider({ children }: AchievementsProviderProps) {
  const { user, updateUser } = useAuth();
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([]);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const refresh = useCallback(async () => {
    if (!userRef.current) {
      setCategories([]);
      return;
    }
    setLoading(true);
    try {
      setCategories(await getAchievements());
    } catch {
      // Страница достижений не должна ломать остальной интерфейс
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setCategories([]);
      setUnlocked([]);
      return;
    }
    void refresh();
  }, [user?.id, refresh]);

  const sync = useCallback(
    async (extra?: AchievementSyncExtra) => {
      const currentUser = userRef.current;
      if (!currentUser) return;

      const owner = String(currentUser.id);
      const payload = {
        ...collectAchievementStats(owner),
        ...extra,
      };

      try {
        const result = await syncAchievements(payload);
        updateUser(result.user);

        if (result.unlocked_achievements.length > 0) {
          setUnlocked((previous) => {
            const known = new Set(previous.map((item) => item.id));
            const fresh = result.unlocked_achievements.filter(
              (item) => !known.has(item.id),
            );
            return fresh.length > 0 ? [...previous, ...fresh] : previous;
          });
          void refresh();
        }
      } catch {
        // Не блокируем обучение из-за фоновой проверки достижений
      }
    },
    [refresh, updateUser],
  );

  const clearUnlocked = useCallback(() => setUnlocked([]), []);

  const value = useMemo(
    () => ({
      categories,
      loading,
      unlocked,
      clearUnlocked,
      sync,
      refresh,
    }),
    [categories, loading, unlocked, clearUnlocked, sync, refresh],
  );

  return (
    <AchievementContext.Provider value={value}>
      {children}
      <AchievementUnlockModal
        achievements={unlocked}
        onClose={clearUnlocked}
      />
    </AchievementContext.Provider>
  );
}
