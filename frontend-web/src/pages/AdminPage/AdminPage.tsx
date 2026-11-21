import { useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  ScrollText,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminGrammar from "./AdminGrammar";
import AdminLibrary from "./AdminLibrary";
import AdminTips from "./AdminTips";
import AdminCourse from "./AdminCourse";
import AdminAchievements from "./AdminAchievements";
import AdminLogs from "./AdminLogs";

type AdminTab =
  | "dashboard"
  | "users"
  | "grammar"
  | "library"
  | "tips"
  | "course"
  | "achievements"
  | "logs";

const TABS: { id: AdminTab; label: string; icon: ReactNode }[] = [
  { id: "dashboard", label: "Обзор", icon: <LayoutDashboard size={18} /> },
  { id: "users", label: "Пользователи", icon: <Users size={18} /> },
  { id: "course", label: "Курс", icon: <BookOpen size={18} /> },
  { id: "grammar", label: "Грамматика", icon: <GraduationCap size={18} /> },
  { id: "library", label: "Библиотека", icon: <FileText size={18} /> },
  { id: "tips", label: "Советы", icon: <Lightbulb size={18} /> },
  { id: "achievements", label: "Достижения", icon: <Trophy size={18} /> },
  { id: "logs", label: "Логи", icon: <ScrollText size={18} /> },
];

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("dashboard");

  return (
    <div className="page admin-page">
      <header className="page__header admin-page__header">
        <div>
          <span className="admin-page__eyebrow">
            <Shield size={15} />
            Только для администратора
          </span>
          <h1 className="page__title">Админ-панель</h1>
          <p className="admin-page__subtitle">
            Управление контентом, пользователями и достижениями
          </p>
        </div>
        <span className="admin-page__badge">
          <BarChart3 size={16} />
          Hanibo admin
        </span>
      </header>

      <div className="admin-layout">
        <nav className="admin-nav" aria-label="Разделы админки">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                "admin-nav__item" +
                (tab === item.id ? " admin-nav__item--active" : "")
              }
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <main className="admin-content">
          {tab === "dashboard" && <AdminDashboard />}
          {tab === "users" && <AdminUsers />}
          {tab === "grammar" && <AdminGrammar />}
          {tab === "library" && <AdminLibrary />}
          {tab === "tips" && <AdminTips />}
          {tab === "course" && <AdminCourse />}
          {tab === "achievements" && <AdminAchievements />}
          {tab === "logs" && <AdminLogs />}
        </main>
      </div>
    </div>
  );
}
