import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import {
  getAdminCourse,
  updateAdminCourseItem,
  type AdminCourseItem,
  type AdminOption,
} from "../../api/admin";
import StateBlock from "../../components/StateBlock/StateBlock";

export default function AdminCourse() {
  const [items, setItems] = useState<AdminCourseItem[]>([]);
  const [levels, setLevels] = useState<AdminOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAdminCourse();
      setItems(data.data);
      setLevels(data.levels);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = (id: number, patchData: Partial<AdminCourseItem>) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, ...patchData } : item,
      ),
    );
  };

  const save = async (item: AdminCourseItem) => {
    setSavingId(item.id);
    setMessage("");
    try {
      await updateAdminCourseItem(item.id, {
        title: item.title,
        order: item.order,
        level_id: item.level_id,
      });
      setMessage("Сохранено");
    } catch {
      setMessage("Не удалось сохранить");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <StateBlock variant="loading" />;
  if (error) return <StateBlock variant="error" onRetry={load} />;

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2>Элементы курса</h2>
          <p>
            Название, порядок и уровень. Уроки и тесты создаются сидерами/БД.
          </p>
        </div>
      </div>

      {message && <p className="admin-info">{message}</p>}

      <div className="admin-table-wrap card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Тип</th>
              <th>Название</th>
              <th>Порядок</th>
              <th>Уровень</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>{item.type}</td>
                <td>
                  <input
                    className="input"
                    value={item.title}
                    onChange={(event) =>
                      patch(item.id, { title: event.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    className="input admin-input--tiny"
                    type="number"
                    min={1}
                    value={item.order}
                    onChange={(event) =>
                      patch(item.id, { order: Number(event.target.value) })
                    }
                  />
                </td>
                <td>
                  <select
                    className="select"
                    value={item.level_id ?? ""}
                    onChange={(event) =>
                      patch(item.id, {
                        level_id: event.target.value
                          ? Number(event.target.value)
                          : null,
                      })
                    }
                  >
                    <option value="">—</option>
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn--accent btn--sm"
                    disabled={savingId === item.id}
                    onClick={() => void save(item)}
                  >
                    <Save size={14} />
                    Сохранить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
