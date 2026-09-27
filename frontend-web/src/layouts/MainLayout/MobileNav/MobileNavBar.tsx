import { NavLink } from "react-router-dom";
import { Home, BookOpen, LogIn, Menu } from "lucide-react";

interface MobileNavBarProps {
  sheetOpen: boolean;
  onToggleSheet: () => void;
}

const items = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/course", label: "Курс", icon: BookOpen },
  { to: "/login", label: "Войти", icon: LogIn },
];

export default function MobileNavBar({
  sheetOpen,
  onToggleSheet,
}: MobileNavBarProps) {
  return (
    <nav className="mobile-nav-bar">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `mobile-nav-bar__item${isActive ? " mobile-nav-bar__item--active" : ""}`
          }
        >
          <Icon size={22} />
          <span className="mobile-nav-bar__label">{label}</span>
        </NavLink>
      ))}

      <button
        type="button"
        className={`mobile-nav-bar__item mobile-nav-bar__burger${sheetOpen ? " mobile-nav-bar__burger--open" : ""}`}
        onClick={onToggleSheet}
        aria-label={sheetOpen ? "Закрыть меню" : "Открыть меню"}
      >
        <Menu size={22} />
        <span className="mobile-nav-bar__label">Меню</span>
      </button>
    </nav>
  );
}
