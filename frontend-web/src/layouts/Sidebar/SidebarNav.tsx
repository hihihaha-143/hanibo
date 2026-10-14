import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, BookOpen, Library, Dumbbell, ShoppingBag } from "lucide-react";
import { spring } from "../../lib/motion";
import { useAuth } from "../../context/useAuth";

interface SidebarNavProps {
  expanded: boolean;
}

const guestItems = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/course", label: "Курс", icon: BookOpen },
];

const studentItems = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/course", label: "Курс", icon: BookOpen },
  { to: "/library", label: "Библиотека", icon: Library },
  { to: "/practice", label: "Практика", icon: Dumbbell },
  { to: "/shop", label: "Магазин", icon: ShoppingBag },
];

export default function SidebarNav({ expanded }: SidebarNavProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const { user } = useAuth();

  const items = user ? studentItems : guestItems;

  return (
    <nav className="sidebar-nav">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="sidebar-nav__item"
          onMouseEnter={() => setHovered(to)}
          onMouseLeave={() => setHovered(null)}
        >
          {({ isActive }) => {
            const showHighlight = hovered ? hovered === to : isActive;
            return (
              <>
                {showHighlight && (
                  <motion.span
                    className="sidebar-nav__highlight"
                    layoutId="sidebar-highlight"
                    transition={spring.bouncy}
                  />
                )}
                <span className="sidebar-nav__icon">
                  <Icon size={22} />
                </span>
                <motion.span
                  className="sidebar-nav__label"
                  animate={{ opacity: expanded ? 1 : 0 }}
                  transition={spring.base}
                >
                  {label}
                </motion.span>
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
}
