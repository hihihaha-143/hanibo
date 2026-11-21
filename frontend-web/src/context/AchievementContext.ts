import { createContext } from "react";
import type { AchievementCategory } from "../api/achievements";
import type { UnlockedAchievement } from "../api/alphabet";
import type { AchievementStats } from "../lib/achievementStats";

export interface AchievementSyncExtra extends Partial<AchievementStats> {
  profile_visited?: boolean;
}

export interface AchievementContextValue {
  categories: AchievementCategory[];
  loading: boolean;
  unlocked: UnlockedAchievement[];
  clearUnlocked: () => void;
  sync: (extra?: AchievementSyncExtra) => Promise<void>;
  refresh: () => Promise<void>;
}

export const AchievementContext = createContext<AchievementContextValue | null>(
  null,
);
