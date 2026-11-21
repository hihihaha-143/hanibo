import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  deleteAdminGrammar,
  getAdminGrammar,
  saveAdminGrammar,
  type AdminGrammarResponse,
  type AdminGrammarRule,
} from "../../api/admin";
import StateBlock from "../../components/StateBlock/StateBlock";

const EMPTY_FORM = {
  title: "",
  construction: "",
  level_id: null as number | null,
  form_id: null as number | null,
};

export default function AdminGrammar() {
  const [data, setData] = useState<AdminGrammarResponse | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setData(await getAdminGrammar(search, page));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const startEdit = (rule: AdminGrammarRule) => {
    setEditingId(rule.id);
    setForm({
      title: rule.title,
      construction: rule.construction,
      level_id: rule.level_id,
      form_id: rule.form_id,
    });
    setFormError("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await saveAdminGrammar(editingId, form);
      resetForm();
      await load();
    } catch {
      setFormError("Не удалось сохранить правило.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (rule: AdminGrammarRule) => {
    if (!window.confirm(`Удалить правило «${rule.title}»?`)) return;
    try {
      await deleteAdminGrammar(rule.id);
      await load();
    } catch {
      setFormError("Не удалось удалить правило.");
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2>Грамматика</h2>
          <p>Правила, конструкции, уровни и формы.</p>
        </div>
      </div>

      <form className="card admin-form admin-form--grid" onSubmit={submit}>
        <label className="admin-field admin-field--wide">
          <span>{editingId ? "Редактировать правило" : "Новое правило"}</span>
          <input
            className="input"
            placeholder="Название"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            required
          />
        </label>
        <label className="admin-field admin-field--wide">
          <span>Конструкция</span>
          <textarea
            className="input"
            rows={2}
            placeholder="예: -아/어요"
            value={form.construction}
            onChange={(event) =>
              setForm({ ...form, construction: event.target.value })
            }
            required
          />
        </label>
        <label className="admin-field">
          <span>Уровень</span>
          <select
            className="select"
            value={form.level_id ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                level_id: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
          >
            <option value="">Без уровня</option>
            {data?.levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.title}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>Форма</span>
          <select
            className="select"
            value={form.form_id ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                form_id: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
          >
            <option value="">Без формы</option>
            {data?.forms.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        {formError && <p className="admin-error admin-field--wide">{formError}</p>}
        <div className="admin-form__actions admin-field--wide">
          {editingId && (
            <button type="button" className="btn btn--ghost" onClick={resetForm}>
              Отмена
            </button>
          )}
          <button type="submit" className="btn btn--accent" disabled={saving}>
            <Plus size={16} />
            {saving ? "Сохраняем…" : editingId ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </form>

      <div className="admin-toolbar">
        <div className="input-wrap">
          <span className="input-wrap__icon">
            <Search size={17} />
          </span>
          <input
            className="input input--with-icon"
            placeholder="Поиск правила"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

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
                  <th>Правило</th>
                  <th>Конструкция</th>
                  <th>Уровень</th>
                  <th>Форма</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.data.map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <strong>{rule.title}</strong>
                    </td>
                    <td>{rule.construction}</td>
                    <td>{rule.level ?? "—"}</td>
                    <td>{rule.form ?? "—"}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="btn btn--ghost btn--icon"
                          onClick={() => startEdit(rule)}
                          aria-label="Редактировать"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost btn--icon"
                          onClick={() => void remove(rule)}
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
        <StateBlock variant="empty" text="Правил пока нет." />
      )}
    </div>
  );
}
