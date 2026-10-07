import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useTheme } from "../../../context/useTheme";

interface SidebarBottomProps {
  expanded: boolean;
}

export default function SidebarBottom({ expanded }: SidebarBottomProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`sidebar-bottom${expanded ? " sidebar-bottom--expanded" : ""}`}
    >
      {/* Switch — временный, стили потом переделаем */}
      <label className="theme-switch">
        <input type="checkbox" checked={isDark} onChange={toggleTheme} />
        <span className="theme-switch__slider" />
      </label>

      <Link to="/login" className="sidebar-bottom__login">
        <span className="sidebar-bottom__icon">
          <LogIn size={22} />
        </span>
        <span className="sidebar-bottom__label">Войти</span>
      </Link>
    </div>
  );
}
