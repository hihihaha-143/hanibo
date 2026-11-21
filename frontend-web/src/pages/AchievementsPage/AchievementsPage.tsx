import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Trophy } from "lucide-react";
import { useAchievements } from "../../context/useAchievements";
import { useAuth } from "../../context/useAuth";
import AchievementIcon from "../../components/AchievementIcon/AchievementIcon";
import type { AchievementItem } from "../../api/achievements";

type StatusFilter = "all" | "unlocked" | "locked" | "secret";

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "unlocked", label: "Полученные" },
  { id: "locked", label: "В процессе" },
  { id: "secret", label: "Секретные" },
];

export default function AchievementsPage() {
  const { user } = useAuth();
  const { categories, loading } = useAchievements();
  const [categoryCode, setCategoryCode] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return categories
      .filter((category) => categoryCode === "all" || category.code === categoryCode)
      .map((category) => ({
        ...category,
        achievements: category.achievements.filter((achievement) => {
          if (status === "unlocked") return achievement.unlocked;
          if (status === "locked") return !achievement.unlocked && !achievement.is_hidden;
          if (status === "secret") return achievement.is_hidden && !achievement.unlocked;
          return true;
        }),
      }))
      .filter((category) => category.achievements.length > 0);
  }, [categories, categoryCode, status]);

  const all = categories.flatMap((category) => category.achievements);
  const unlockedCount = all.filter((item) => item.unlocked).length;
  const secretCount = all.filter((item) => item.is_hidden).length;
  const totalCount = all.length;

  if (!user) {
    return (
      <div className="page achievements-page">
        <p>Войдите, чтобы увидеть достижения.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page achievements-page">
        <p className="achievements-page__state">Загружаем достижения…</p>
      </div>
    );
  }

  return (
    <div className="page achievements-page">
      <Link to="/profile" className="achievements-page__back">
        <ArrowLeft size={16} />
        В профиль
      </Link>

      <header className="achievements-page__header">
        <div>
          <span className="achievements-page__eyebrow">
            <Trophy size={16} />
            Коллекция
          </span>
          <h1>Достижения</h1>
          <p>
            {unlockedCount} из {totalCount} · {secretCount} секретных
          </p>
        </div>
        <span className="achievements-page__percent">
          {totalCount ? Math.round((unlockedCount / totalCount) * 100) : 0}%
        </span>
      </header>

      <div className="achievements-page__bar" aria-hidden="true">
        <span
          style={{
            width: `${totalCount ? (unlockedCount / totalCount) * 100 : 0}%`,
          }}
        />
      </div>

      <div className="achievements-page__filters">
        <div className="achievements-page__chips">
          <button
            type="button"
            className={"chip" + (categoryCode === "all" ? " chip--active" : "")}
            onClick={() => setCategoryCode("all")}
          >
            Все разделы
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={
                "chip" + (categoryCode === category.code ? " chip--active" : "")
              }
              onClick={() => setCategoryCode(category.code)}
            >
              {category.title}
            </button>
          ))}
        </div>

        <div className="achievements-page__chips">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={"chip" + (status === tab.id ? " chip--active" : "")}
              onClick={() => setStatus(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="achievements-page__state">Здесь пока пусто.</p>
      ) : (
        <div className="achievements-page__groups">
          {filtered.map((category) => (
            <section key={category.id} className="achievements-page__group">
              <div className="achievements-page__group-head">
                <h2>{category.title}</h2>
                <span>
                  {category.achievements.filter((item) => item.unlocked).length}
                  {" / "}
                  {category.achievements.length}
                </span>
              </div>
              <div className="achievements-page__grid">
                {category.achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: AchievementItem }) {
  const secret = achievement.is_hidden && !achievement.unlocked;

  return (
    <article
      className={
        "achievement-card" +
        (achievement.unlocked ? " achievement-card--unlocked" : "") +
        (secret ? " achievement-card--secret" : "")
      }
    >
      <span className="achievement-card__icon">
        {secret ? <Lock size={20} /> : <AchievementIcon name={achievement.icon} size={22} />}
      </span>
      <div className="achievement-card__body">
        <strong>{achievement.title}</strong>
        <p>{achievement.description}</p>
        <span>
          {achievement.unlocked
            ? "Получено"
            : secret
              ? "Секретное достижение"
              : `+${achievement.blueberry_reward} черники`}
        </span>
      </div>
      {achievement.unlocked && <span className="achievement-card__check">✓</span>}
    </article>
  );
}
