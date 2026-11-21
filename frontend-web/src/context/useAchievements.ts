import { useContext } from "react";
import { AchievementContext } from "./AchievementContext";

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievements must be used within AchievementsProvider");
  }
  return context;
}
