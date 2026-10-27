  import { useEffect } from "react";
  import { AnimatePresence, motion } from "framer-motion";
  import { Flame, ShieldCheck } from "lucide-react";
  import { spring } from "../../lib/motion";
  import { useAuth } from "../../context/useAuth";

  export default function StreakToast() {
    const { refreshDaily, clearRefreshDaily } = useAuth();

    useEffect(() => {
      if (!refreshDaily) return;
      if (!refreshDaily.freeze_used && !refreshDaily.streak_reset) return;

      const timer = setTimeout(() => {
        clearRefreshDaily();
      }, 5000);

      return () => clearTimeout(timer);
    }, [refreshDaily, clearRefreshDaily]);

    if (!refreshDaily) return null;
    if (!refreshDaily.freeze_used && !refreshDaily.streak_reset) return null;

    const isFreeze = refreshDaily.freeze_used;

    return (
      <AnimatePresence>
        <motion.div
          className="streak-toast"
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={spring.bouncy}
          onClick={clearRefreshDaily}
        >
          <div className="streak-toast__icon">
            {isFreeze ? <ShieldCheck size={22} /> : <Flame size={22} />}
          </div>
          <div className="streak-toast__content">
            {isFreeze ? (
              <>
                <span className="streak-toast__title">Стрик сохранён!</span>
                <span className="streak-toast__desc">
                  Использовано заморозок: {refreshDaily.freezes_used}
                </span>
              </>
            ) : (
              <>
                <span className="streak-toast__title">Стрик сброшен</span>
                <span className="streak-toast__desc">
                  Заморозок не хватило. Начни серию заново!
                </span>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
