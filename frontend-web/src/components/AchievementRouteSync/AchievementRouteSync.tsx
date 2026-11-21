import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useAchievements } from "../../context/useAchievements";

export default function AchievementRouteSync() {
  const { user, isLoading } = useAuth();
  const { sync } = useAchievements();
  const location = useLocation();

  useEffect(() => {
    if (!user?.id || isLoading) return;

    const timer = window.setTimeout(() => {
      void sync({ profile_visited: location.pathname === "/profile" });
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
