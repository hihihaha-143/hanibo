import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useTheme } from "../../context/useTheme";
import { spring } from "../../lib/motion";

interface SidebarBottomProps {
  expanded: boolean;
}

const MotionLink = motion.create(Link);

export default function SidebarBottom({ expanded }: SidebarBottomProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className="sidebar-bottom"
      animate={{ opacity: expanded ? 1 : 0 }}
      transition={spring.base}
    >
      <label className="theme-switch">
        <input type="checkbox" checked={isDark} onChange={toggleTheme} />
        <span className="theme-switch__slider" />
      </label>

      <MotionLink
        to="/login"
        className="sidebar-bottom__login"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={spring.bouncy}
      >
        <span className="sidebar-bottom__icon">
          <LogIn size={22} />
        </span>
        <span className="sidebar-bottom__label">Войти</span>
      </MotionLink>
    </motion.div>
  );
}
