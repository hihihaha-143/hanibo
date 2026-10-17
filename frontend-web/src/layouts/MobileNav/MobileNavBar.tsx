import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, BookOpen, LogIn, Menu, Dumbbell } from "lucide-react";
import { spring } from "../../lib/motion";
import { useAuth } from "../../context/useAuth";

interface MobileNavBarProps {
  sheetOpen: boolean;
  onToggleSheet: () => void;
}

export default function MobileNavBar({
  sheetOpen,
  onToggleSheet,
}: MobileNavBarProps) {
  const { isAuthenticated } = useAuth();
  const [hovered, setHovered] = useState<string | null>(null);

  const items = isAuthenticated
    ? [
        { to: "/", label: "Главная", icon: Home },
        { to: "/course", label: "Курс", icon: BookOpen },
        { to: "/practice", label: "Практика", icon: Dumbbell },
      ]
    : [
        { to: "/", label: "Главная", icon: Home },
        { to: "/course", label: "Курс", icon: BookOpen },
        { to: "/login", label: "Войти", icon: LogIn },
      ];

  return (
    <nav className="mobile-nav-bar">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="mobile-nav-bar__item"
          onMouseEnter={() => setHovered(to)}
          onMouseLeave={() => setHovered(null)}
        >
          {({ isActive }) => {
            const showHighlight = hovered ? hovered === to : isActive;
            return (
              <>
                {showHighlight && (
                  <motion.span
                    className="mobile-nav-bar__highlight"
                    layoutId="mobile-nav-highlight"
                    transition={spring.bouncy}
                  />
                )}
                <span className="mobile-nav-bar__icon">
                  <Icon size={22} />
                </span>
                <span className="mobile-nav-bar__label">{label}</span>
              </>
            );
          }}
        </NavLink>
      ))}

      <motion.button
        type="button"
        className="mobile-nav-bar__item"
        onClick={onToggleSheet}
        aria-label={sheetOpen ? "Закрыть меню" : "Открыть меню"}
        whileTap={{ scale: 0.9 }}
        transition={spring.bouncy}
      >
        <motion.span
          className="mobile-nav-bar__icon"
          animate={{ rotate: sheetOpen ? 90 : 0 }}
          transition={spring.bouncy}
        >
          <Menu size={22} />
        </motion.span>
        <span className="mobile-nav-bar__label">Меню</span>
      </motion.button>
    </nav>
  );
}
