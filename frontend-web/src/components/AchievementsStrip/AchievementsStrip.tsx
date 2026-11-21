import { Link } from "react-router-dom";
import { ArrowRight, Trophy } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useAchievements } from "../../context/useAchievements";
import AchievementIcon from "../AchievementIcon/AchievementIcon";

interface AchievementsStripProps {
  categoryCode: string;
}

export default function AchievementsStrip({
  categoryCode,
}: AchievementsStripProps) {
  const { user } = useAuth();
  const { categories } = useAchievements();

  if (!user) return null;

  const category = categories.find((item) => item.code === categoryCode);
  if (!category || category.achievements.length === 0) return null;

  const unlocked = category.achievements.filter((item) => item.unlocked);
  const next = category.achievements
    .filter((item) => !item.unlocked)
    .slice(0, 3);
  const visible = next.length > 0 ? next : category.achievements.slice(0, 3);

  return (
    <section className="achievements-strip" aria-label="Достижения страницы">
      <div className="achievements-strip__head">
        <span className="achievements-strip__title">
          <Trophy size={16} aria-hidden="true" />
          {category.title}
          <span className="achievements-strip__count">
            {unlocked.length}/{category.achievements.length}
          </span>
        </span>
        <Link to="/achievements" className="achievements-strip__all">
          Все
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="achievements-strip__list">
        {visible.map((achievement) => (
          <Link
            key={achievement.id}
            to="/achievements"
            className={
              "achievements-strip__item" +
              (achievement.unlocked
                ? " achievements-strip__item--unlocked"
                : "")
            }
          >
            <span className="achievements-strip__icon">
              <AchievementIcon name={achievement.icon} size={17} />
            </span>
            <span className="achievements-strip__body">
              <strong>{achievement.title}</strong>
              <span>
                {achievement.unlocked
                  ? "Получено"
                  : `+${achievement.blueberry_reward} черники`}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
