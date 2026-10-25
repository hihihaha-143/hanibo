import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { useTheme } from "../../context/useTheme";
import { useAuth } from "../../context/useAuth";
import { spring } from "../../lib/motion";

interface SidebarBottomProps {
  expanded: boolean;
}

const MotionLink = motion.create(Link);

export default function SidebarBottom({ expanded }: SidebarBottomProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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

      {isAuthenticated && user ? (
        <div className="sidebar-bottom__user">
          <div className="sidebar-bottom__user-info">
            {user.avatar ? (
              <img
                className="sidebar-bottom__user-avatar"
                src={user.avatar}
                alt={user.nickname}
              />
            ) : (
              <span className="sidebar-bottom__user-avatar sidebar-bottom__user-avatar--placeholder">
                {user.nickname.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="sidebar-bottom__user-text">
              {user.selected_title && (
                <span className="sidebar-bottom__user-title">
                  {user.selected_title.title}
                </span>
              )}
              <span className="sidebar-bottom__user-nickname">
                {user.nickname}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-bottom__logout"
            onClick={handleLogout}
            aria-label="Выйти"
          >
            <LogOut size={20} />
          </button>
        </div>
      ) : (
        <>
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

          <MotionLink
            to="/register"
            className="sidebar-bottom__register"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            <span className="sidebar-bottom__icon">
              <UserPlus size={22} />
            </span>
            <span className="sidebar-bottom__label">Регистрация</span>
          </MotionLink>
        </>
      )}
    </motion.div>
  );
}
