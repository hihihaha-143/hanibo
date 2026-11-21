import { useCallback, useEffect, useState } from "react";
import { getAdminAchievements, type AdminAchievement } from "../../api/admin";
import StateBlock from "../../components/StateBlock/StateBlock";

export default function AdminAchievements() {
  const [items, setItems] = useState<AdminAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setItems((await getAdminAchievements()).data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <StateBlock variant="loading" />;
  if (error) return <StateBlock variant="error" onRetry={load} />;

  const groups = items.reduce<Record<string, AdminAchievement[]>>(
    (acc, item) => {
      const key = item.category?.title ?? "Без категории";
      acc[key] = [...(acc[key] ?? []), item];
      return acc;
    },
    {},
  );

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2>Достижения</h2>
          <p>Просмотр выданных определений и наград. Редактирование — через сидер.</p>
        </div>
      </div>

      {Object.entries(groups).map(([category, list]) => (
        <section key={category} className="admin-achievement-group">
          <h3>
            {category} <span>{list.length}</span>
          </h3>
          <div className="admin-achievement-grid">
            {list.map((item) => (
              <article key={item.id} className="card admin-achievement">
                <div>
                  <strong>{item.is_hidden ? "Секретное" : item.title}</strong>
                  <p>{item.is_hidden ? "Условие скрыто" : item.description}</p>
                </div>
                <span>+{item.blueberry_reward} 🫐</span>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
