import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import { useAuth } from "../../context/useAuth";
import { spring } from "../../lib/motion";

interface MobileNavSheetProps {
  onClose: () => void;
}

export default function MobileNavSheet({ onClose }: MobileNavSheetProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/");
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="mobile-nav-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Bottom sheet */}
      <motion.div
        className="mobile-nav-sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={spring.bouncy}
      >
        <div className="mobile-nav-sheet__theme">
          <label className="theme-switch">
            <input type="checkbox" checked={isDark} onChange={toggleTheme} />
            <span className="theme-switch__slider" />
          </label>
        </div>

        {isAuthenticated && user && (
          <div className="mobile-nav-sheet__user">
            <div className="mobile-nav-sheet__user-info">
              {user.avatar ? (
                <img
                  className="mobile-nav-sheet__user-avatar"
                  src={user.avatar}
                  alt={user.nickname}
                />
              ) : (
                <span className="mobile-nav-sheet__user-avatar mobile-nav-sheet__user-avatar--placeholder">
                  {user.nickname.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="mobile-nav-sheet__user-nickname">
                {user.nickname}
              </span>
            </div>

            <button
              type="button"
              className="mobile-nav-sheet__logout"
              onClick={handleLogout}
              aria-label="Выйти"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
