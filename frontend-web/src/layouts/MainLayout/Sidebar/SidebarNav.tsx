import { NavLink } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";

interface SidebarNavProps {
  expanded: boolean;
}

const items = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/course", label: "Курс", icon: BookOpen },
];

export default function SidebarNav({ expanded }: SidebarNavProps) {
  return (
    <nav className="sidebar-nav">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `sidebar-nav__item${isActive ? " sidebar-nav__item--active" : ""}`
          }
        >
          <span className="sidebar-nav__icon">
            <Icon size={22} />
          </span>
          <span className="sidebar-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
