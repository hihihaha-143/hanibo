import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Flame } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { indicatorVariants, spring } from "../../lib/motion";
import strawberryIcon from "../../assets/strawberry.png";
import blueberryIcon from "../../assets/blueberry.png";

export default function BannerStats() {
  const { user } = useAuth();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  if (!user) return null;

  const stats = [
    {
      key: "strawberry",
      icon: <img src={strawberryIcon} alt="" />,
      value: user.strawberry,
      label: "Клубника, проходи тесты для получения",
    },
    {
      key: "blueberry",
      icon: <img src={blueberryIcon} alt="" />,
      value: user.blueberry,
      label: "Черника, проходи тесты для получения",
    },
    { key: "exp", icon: <Star size={24} />, value: user.exp, label: "Опыт" },
    {
      key: "streak",
      icon: <Flame size={24} />,
      value: user.streak_current,
      label: "Серия дней",
    },
  ];

  return (
    <div className="banner-stats">
      {stats.map(({ key, icon, value, label }) => (
        <motion.div
          key={key}
          className="banner-stats__item"
          onHoverStart={() => setHoveredKey(key)}
          onHoverEnd={() => setHoveredKey(null)}
        >
          <span className="banner-stats__icon">{icon}</span>
          <span className="banner-stats__value">{value}</span>

          <AnimatePresence>
            {hoveredKey === key && (
              <motion.span
                className="banner-stats__tooltip"
                role="tooltip"
                variants={indicatorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={spring.soft}
              >
                <span className="banner-stats__tooltip-line">
                  <strong>{label}</strong>
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
