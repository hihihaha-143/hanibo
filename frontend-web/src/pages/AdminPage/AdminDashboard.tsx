import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Lightbulb,
  ShoppingBag,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { getAdminStats, type AdminStats } from "../../api/admin";
import StateBlock from "../../components/StateBlock/StateBlock";

const CARDS: {
  key: keyof AdminStats;
  label: string;
  icon: ReactNode;
}[] = [
  { key: "users", label: "Пользователи", icon: <Users size={20} /> },
  { key: "admins", label: "Админы", icon: <Trophy size={20} /> },
  { key: "course_items", label: "Элементы курса", icon: <BookOpen size={20} /> },
  { key: "grammar_rules", label: "Грамматика", icon: <GraduationCap size={20} /> },
  { key: "library_items", label: "Библиотека", icon: <FileText size={20} /> },
  { key: "tips", label: "Советы", icon: <Lightbulb size={20} /> },
  { key: "achievements", label: "Достижения", icon: <Sparkles size={20} /> },
  { key: "shop_items", label: "Магазин", icon: <ShoppingBag size={20} /> },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      setStats(await getAdminStats());
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <StateBlock variant="error" onRetry={load} />;
  if (!stats) return <StateBlock variant="loading" />;

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2>Обзор платформы</h2>
          <p>Сводка по контенту и пользователям.</p>
        </div>
      </div>

      <div className="admin-stats">
        {CARDS.map((card) => (
          <div key={card.key} className="card admin-stat">
            <span className="admin-stat__icon">{card.icon}</span>
            <span>{card.label}</span>
            <strong>{stats[card.key]}</strong>
          </div>
        ))}
      </div>

      <div className="card admin-note">
        <strong>Быстрый доступ</strong>
        <p>
          Пользователи, курс, грамматика, библиотека, советы, достижения и
          технические логи — во вкладках слева.
        </p>
      </div>
    </div>
  );
}
