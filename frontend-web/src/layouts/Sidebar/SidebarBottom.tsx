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

  const nicknameColor = user?.selected_nickname_color?.color ?? undefined;
  const frame = user?.selected_frame ?? null;
  const icons = user?.selected_icons ?? [];
  const status = user?.selected_status ?? null;

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
            <span
              className={`sidebar-bottom__user-avatar-wrap${
                frame ? " sidebar-bottom__user-avatar-wrap--framed" : ""
              }`}
              style={
                frame?.image
                  ? { backgroundImage: `url(${frame.image})` }
                  : undefined
              }
            >
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
            </span>

            <div className="sidebar-bottom__user-text">
              {user.selected_title && (
                <span className="sidebar-bottom__user-title">
                  {user.selected_title.title}
                </span>
              )}

              <span className="sidebar-bottom__user-nickname-row">
                <span
                  className="sidebar-bottom__user-nickname"
                  style={nicknameColor ? { color: nicknameColor } : undefined}
                >
                  {user.nickname}
                </span>

                {icons.length > 0 && (
                  <span className="sidebar-bottom__user-icons">
                    {icons.map((icon) =>
                      icon.image ? (
                        <img
                          key={icon.id}
                          src={icon.image}
                          alt={icon.title}
                          className="sidebar-bottom__user-icon"
                        />
                      ) : (
                        <span
                          key={icon.id}
                          className="sidebar-bottom__user-icon sidebar-bottom__user-icon--fallback"
                        >
                          {icon.title.charAt(0).toUpperCase()}
                        </span>
                      ),
                    )}
                  </span>
                )}
              </span>

              {status && (
                <span className="sidebar-bottom__user-status">
                  {status.text || status.title}
                </span>
              )}
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
