import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useAchievements } from "../../context/useAchievements";
import { getProfileVisits, recordProfileVisit } from "../../lib/achievementStats";

export default function AchievementRouteSync() {
  const { user, isLoading } = useAuth();
  const { sync } = useAchievements();
  const location = useLocation();

  useEffect(() => {
    if (!user?.id || isLoading) return;

    const timer = window.setTimeout(() => {
      const isProfile = location.pathname === "/profile";
      const profileVisits = isProfile
        ? recordProfileVisit(String(user?.id))
        : getProfileVisits(String(user?.id));

      void sync({
        profile_visited: isProfile,
        settings_visited: location.pathname === "/settings",
        profile_visits: profileVisits,
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [user?.id, isLoading, location.pathname, sync]);

  useEffect(() => {
    if (!user?.id) return;

    const handleSync = () => {
      void sync();
    };

    window.addEventListener("hanibo:achievements-sync", handleSync);
    return () => {
      window.removeEventListener("hanibo:achievements-sync", handleSync);
    };
  }, [user?.id, sync]);

  return null;
}
