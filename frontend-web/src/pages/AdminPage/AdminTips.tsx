import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteAdminTip,
  getAdminTips,
  saveAdminTip,
  type AdminList,
  type AdminTip,
} from "../../api/admin";
import StateBlock from "../../components/StateBlock/StateBlock";

const EMPTY = { type: "advice" as "advice" | "fact", content: "" };

export default function AdminTips() {
  const [data, setData] = useState<AdminList<AdminTip> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setData(await getAdminTips(page));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const reset = () => {
    setEditingId(null);
    setForm(EMPTY);
    setFormError("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await saveAdminTip(editingId, form);
      reset();
      await load();
    } catch {
      setFormError("Не удалось сохранить совет.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (tip: AdminTip) => {
    if (!window.confirm("Удалить совет?")) return;
    try {
      await deleteAdminTip(tip.id);
      await load();
    } catch {
      setFormError("Не удалось удалить совет.");
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2>Советы и факты</h2>
          <p>Показываются в блоке рекомендации на главной.</p>
        </div>
      </div>

      <form className="card admin-form" onSubmit={submit}>
        <label className="admin-field">
          <span>Тип</span>
          <select
            className="select"
            value={form.type}
            onChange={(event) =>
              setForm({ ...form, type: event.target.value as "advice" | "fact" })
            }
          >
            <option value="advice">Совет</option>
            <option value="fact">Факт</option>
          </select>
        </label>
        <label className="admin-field">
          <span>Текст</span>
          <textarea
            className="input"
            rows={3}
            value={form.content}
            onChange={(event) =>
              setForm({ ...form, content: event.target.value })
            }
            required
          />
        </label>
        {formError && <p className="admin-error">{formError}</p>}
        <div className="admin-form__actions">
          {editingId && (
            <button type="button" className="btn btn--ghost" onClick={reset}>
              Отмена
            </button>
          )}
          <button type="submit" className="btn btn--accent" disabled={saving}>
            <Plus size={16} />
            {saving ? "Сохраняем…" : editingId ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </form>

      {loading ? (
        <StateBlock variant="loading" />
      ) : error ? (
        <StateBlock variant="error" onRetry={load} />
      ) : data && data.data.length > 0 ? (
        <>
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Тип</th>
                  <th>Текст</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.data.map((tip) => (
                  <tr key={tip.id}>
                    <td>{tip.type === "advice" ? "Совет" : "Факт"}</td>
                    <td>{tip.content}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="btn btn--ghost btn--icon"
                          onClick={() => {
                            setEditingId(tip.id);
                            setForm({ type: tip.type, content: tip.content });
                          }}
                          aria-label="Редактировать"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost btn--icon"
                          onClick={() => void remove(tip)}
                          aria-label="Удалить"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-pagination">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Назад
            </button>
            <span>
              {page} / {data.meta.last_page}
            </span>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              disabled={page >= data.meta.last_page}
              onClick={() => setPage((value) => value + 1)}
            >
              Вперёд
            </button>
          </div>
        </>
      ) : (
        <StateBlock variant="empty" text="Советов пока нет." />
      )}
    </div>
  );
}
