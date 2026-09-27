import { useTheme } from "../../../context/useTheme";

interface MobileNavSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNavSheet({ open, onClose }: MobileNavSheetProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-nav-overlay${open ? " mobile-nav-overlay--visible" : ""}`}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        className={`mobile-nav-sheet${open ? " mobile-nav-sheet--open" : ""}`}
      >
        <label className="theme-switch">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="theme-switch__slider" />
        </label>

        {/* Здесь потом будет остальное содержимое */}
      </div>
    </>
  );
}
