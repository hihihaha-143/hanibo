import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LogOut, Award, Clapperboard, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import { useAuth } from "../../context/useAuth";
import { spring } from "../../lib/motion";
import { resolveShopImage, getUserAvatarUrl } from "../../lib/shopImages";

interface MobileNavSheetProps {
  onClose: () => void;
}

export default function MobileNavSheet({ onClose }: MobileNavSheetProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
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
        ref={sheetRef}
        className="mobile-nav-sheet"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={spring.bouncy}
      >
        <div className="mobile-nav-sheet__theme">
          <span>Тёмная тема</span>
          <label className="theme-switch">
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
              aria-label="Тёмная тема"
            />
            <span className="theme-switch__slider" />
          </label>
        </div>

        <Link
          to="/breakdowns"
          className="mobile-nav-sheet__quick-link"
          onClick={onClose}
        >
          <Clapperboard size={18} aria-hidden="true" />
          <span>Разборы</span>
        </Link>

        {isAuthenticated && (
          <Link
            to="/profile"
            className="mobile-nav-sheet__quick-link"
            onClick={onClose}
          >
            <UserRound size={18} aria-hidden="true" />
            <span>Профиль и достижения</span>
          </Link>
        )}

        {isAuthenticated && user && (
          <div className="mobile-nav-sheet__user">
            <div className="mobile-nav-sheet__user-info">
              <span
                className={`mobile-nav-sheet__user-avatar-wrap${
                  frame ? " mobile-nav-sheet__user-avatar-wrap--framed" : ""
                }`}
              >
                {avatarUrl ? (
                  <img
                    className="mobile-nav-sheet__user-avatar"
                    src={avatarUrl}
                    alt={user.nickname}
                  />
                ) : (
                  <span className="mobile-nav-sheet__user-avatar mobile-nav-sheet__user-avatar--placeholder">
                    {user.nickname.charAt(0).toUpperCase()}
                  </span>
                )}

                {frameUrl && (
                  <img
                    src={frameUrl}
                    alt={frame?.title || "Рамка"}
                    className="mobile-nav-sheet__user-frame"
                  />
                )}
              </span>

              <div className="mobile-nav-sheet__user-text">
                {user.selected_title && (
                  <span className="mobile-nav-sheet__user-title">
                    {user.selected_title.title}
                  </span>
                )}
                <span className="mobile-nav-sheet__user-nickname-row">
                  <span
                    className="mobile-nav-sheet__user-nickname"
                    style={nicknameColor ? { color: nicknameColor } : undefined}
                  >
                    {user.nickname}
                  </span>
                  {icons.length > 0 && (
                    <span className="mobile-nav-sheet__user-icons">
                      {icons.map((icon) => {
                        const iconUrl = resolveShopImage(icon.image);
                        return iconUrl ? (
                          <img
                            key={icon.id}
                            src={iconUrl}
                            alt={icon.title}
                            className="mobile-nav-sheet__user-icon"
                          />
                        ) : (
                          <span
                            key={icon.id}
                            className="mobile-nav-sheet__user-icon mobile-nav-sheet__user-icon--fallback"
                          >
                            {icon.title.charAt(0).toUpperCase()}
                          </span>
                        );
                      })}
                    </span>
                  )}
                </span>
                {status && (
                  <span className="mobile-nav-sheet__user-status">
                    {status.text || status.title}
                  </span>
                )}
              </div>
            </div>

            <div className="mobile-nav-sheet__user-actions">
              {medal && (
                <span
                  className="mobile-nav-sheet__user-medal"
                  title={medal.title}
                >
                  {medalUrl ? (
                    <img src={medalUrl} alt={medal.title} />
                  ) : (
                    <Award size={16} />
                  )}
                </span>
              )}
              <button
                type="button"
                className="mobile-nav-sheet__logout"
                onClick={handleLogout}
                aria-label="Выйти"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
