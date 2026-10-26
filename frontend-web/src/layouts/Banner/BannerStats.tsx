import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Flame, Snowflake } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { indicatorVariants, spring } from "../../lib/motion";
import strawberryIcon from "../../assets/strawberry.png";
import blueberryIcon from "../../assets/blueberry.png";

export default function BannerStats() {
  const { user } = useAuth();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tappedKey, setTappedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!tappedKey) return;
    const close = () => setTappedKey(null);
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [tappedKey]);

  if (!user) return null;

  const goalReached = user.goal_reached;
  const expToday = user.exp_today ?? 0;
  const dailyGoal = user.daily_exp_goal ?? 0;
  const freezes = user.streak_freezes ?? 0;

  const stats = [
    {
      key: "strawberry",
      icon: <img src={strawberryIcon} alt="" />,
      value: user.strawberry,
      tooltip: (
        <>
          <span className="banner-stats__tooltip-title">Клубника</span>
          <span className="banner-stats__tooltip-sub">
            Проходи тесты, чтобы получать
          </span>
        </>
      ),
    },
    {
      key: "blueberry",
      icon: <img src={blueberryIcon} alt="" />,
      value: user.blueberry,
      tooltip: (
        <>
          <span className="banner-stats__tooltip-title">Черника</span>
          <span className="banner-stats__tooltip-sub">
            Проходи тесты, чтобы получать
          </span>
        </>
      ),
    },
    {
      key: "exp",
      icon: <Star size={24} />,
      value: expToday,
      tooltip: (
        <>
          <span className="banner-stats__tooltip-title">Опыт за сегодня</span>
          <span className="banner-stats__tooltip-sub">
            {dailyGoal > 0 ? `${expToday} / ${dailyGoal}` : `${expToday}`}
          </span>
        </>
      ),
    },
    {
      key: "streak",
      icon: <Flame size={24} />,
      value: user.streak_current,
      active: goalReached,
      tooltip: (
        <>
          <span className="banner-stats__tooltip-title">Серия дней</span>
          <span className="banner-stats__tooltip-sub">
            {goalReached ? "Цель достигнута" : "Набери норму опыта сегодня"}
          </span>
          {freezes > 0 && (
            <span className="banner-stats__tooltip-sub banner-stats__tooltip-sub--freeze">
              <Snowflake size={12} /> Заморозок: {freezes}
            </span>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="banner-stats">
      {stats.map(({ key, icon, value, active, tooltip }) => {
        const isOpen = hoveredKey === key || tappedKey === key;

        return (
          <motion.div
            key={key}
            className={`banner-stats__item${active ? " banner-stats__item--active" : ""}`}
            onHoverStart={() => setHoveredKey(key)}
            onHoverEnd={() => setHoveredKey(null)}
            onTap={(event) => {
              event.stopPropagation();
              setTappedKey((prev) => (prev === key ? null : key));
            }}
          >
            {key === "streak" ? (
              <motion.span
                className="banner-stats__icon"
                animate={
                  active
                    ? {
                        // «Живой» огонь: покачивание + пульсация + мерцание
                        rotate: [0, -6, 6, -4, 4, 0],
                        scale: [1, 1.08, 0.98, 1.05, 1],
                        opacity: [1, 0.85, 1, 0.9, 1],
                        filter: [
                          "drop-shadow(0 0 0px rgba(255, 180, 50, 0))",
                          "drop-shadow(0 0 10px rgba(255, 180, 50, 0.9))",
                          "drop-shadow(0 0 4px rgba(255, 120, 30, 0.6))",
                          "drop-shadow(0 0 12px rgba(255, 200, 60, 1))",
                          "drop-shadow(0 0 0px rgba(255, 180, 50, 0))",
                        ],
                      }
                    : {
                        rotate: 0,
                        scale: 1,
                        opacity: 1,
                        filter: "drop-shadow(0 0 0px rgba(255, 180, 50, 0))",
                      }
                }
                transition={
                  active
                    ? {
                        duration: 1.6,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }
                    : { duration: 0.25 }
                }
              >
                {icon}
              </motion.span>
            ) : (
              <span className="banner-stats__icon">{icon}</span>
            )}
            <span className="banner-stats__value">{value}</span>

            <AnimatePresence>
              {isOpen && (
                <motion.span
                  className="banner-stats__tooltip"
                  role="tooltip"
                  variants={indicatorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={spring.soft}
                >
                  {tooltip}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
