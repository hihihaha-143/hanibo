import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { spring } from "../../lib/motion";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "0м";
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}ч ${minutes}м` : `${hours}ч`;
  }
  return `${minutes}м`;
}

export default function ExpBoostBadge() {
  const { user } = useAuth();
  const [now, setNow] = useState(() => Date.now());

  const boostUntil = user?.exp_boost_until
    ? new Date(user.exp_boost_until).getTime()
    : null;

  const isActive = boostUntil !== null && boostUntil > now;

  useEffect(() => {
    if (!isActive) return;

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isActive]);

  const remaining = boostUntil ? boostUntil - now : 0;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="exp-boost-badge"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={spring.base}
        >
          <span className="exp-boost-badge__icon">
            <Zap size={18} />
          </span>
          <span className="exp-boost-badge__text">
            <span className="exp-boost-badge__title">×2 опыта</span>
            <span className="exp-boost-badge__time">
              {formatRemaining(remaining)}
            </span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
