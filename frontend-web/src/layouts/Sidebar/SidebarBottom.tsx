import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, LogOut, UserPlus, Award, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/useTheme";
import { useAuth } from "../../context/useAuth";
import { spring } from "../../lib/motion";
import { resolveShopImage, getUserAvatarUrl } from "../../lib/shopImages";

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

  const avatarUrl = getUserAvatarUrl(user);
  const nicknameColor = user?.selected_nickname_color?.color ?? undefined;
  const frame = user?.selected_frame ?? null;
  const frameUrl = resolveShopImage(frame?.image);
  const icons = user?.selected_icons ?? [];
  const status = user?.selected_status ?? null;
  const medal = user?.selected_medal ?? null;
  const medalUrl = resolveShopImage(medal?.image);

  return (
    <motion.div
      className={
        expanded
          ? "sidebar-bottom"
          : "sidebar-bottom sidebar-bottom--collapsed"
      }
      animate={{ opacity: expanded ? 1 : 0 }}
      transition={spring.base}
      aria-hidden={!expanded}
      inert={!expanded}
    >
      <div className="sidebar-bottom__tools">
        <span className="sidebar-bottom__tools-label">Тема</span>
        <label className="theme-switch" title="Переключить тему">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleTheme}
            aria-label="Тёмная тема"
          />
          <span className="theme-switch__slider" />
        </label>
      </div>

      {isAuthenticated && user ? (
        <div className="sidebar-bottom__account-row">
          <Link
            to="/profile"
            className="sidebar-bottom__account"
            aria-label="Открыть профиль"
          >
            <span
              className={`sidebar-bottom__user-avatar-wrap${
                frame ? " sidebar-bottom__user-avatar-wrap--framed" : ""
              }`}
            >
              {avatarUrl ? (
                <img
                  className="sidebar-bottom__user-avatar"
                  src={avatarUrl}
                  alt={user.nickname}
                />
              ) : (
                <span className="sidebar-bottom__user-avatar sidebar-bottom__user-avatar--placeholder">
                  {user.nickname.charAt(0).toUpperCase()}
                </span>
              )}

              {/* Накладываем рамку ПОВЕРХ аватарки */}
              {frameUrl && (
                <img
                  src={frameUrl}
                  alt={frame?.title || "Рамка"}
                  className="sidebar-bottom__user-frame"
                />
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
                    {icons.map((icon) => {
                      const iconUrl = resolveShopImage(icon.image);
                      return iconUrl ? (
                        <img
                          key={icon.id}
                          src={iconUrl}
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
                      );
                    })}
                  </span>
                )}
              </span>

              {status && (
                <span className="sidebar-bottom__user-status">
                  {status.text || status.title}
                </span>
              )}
            </div>
            <ChevronRight
              size={16}
              className="sidebar-bottom__account-arrow"
              aria-hidden="true"
            />
          </Link>

          <div className="sidebar-bottom__user-actions">
            {medal && (
              <span className="sidebar-bottom__user-medal" title={medal.title}>
                {medalUrl ? (
                  <img src={medalUrl} alt={medal.title} />
                ) : (
                  <Award size={16} />
                )}
              </span>
            )}
            <button
              type="button"
              className="sidebar-bottom__logout"
              onClick={handleLogout}
              aria-label="Выйти"
            >
              <LogOut size={20} />
            </button>
          </div>
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
