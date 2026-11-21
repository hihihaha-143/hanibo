import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  deleteAdminLibrary,
  getAdminLibrary,
  saveAdminLibrary,
  type AdminLibraryItem,
  type AdminLibraryPayload,
  type AdminList,
} from "../../api/admin";
import StateBlock from "../../components/StateBlock/StateBlock";

const EMPTY: AdminLibraryPayload = {
  title: "",
  author: "",
  type: "book",
  description: "",
  cover_path: "",
  file_path: "",
  level: "",
  language: "ko",
  pages: null,
  year: null,
};

const TYPE_LABELS: Record<string, string> = {
  textbook: "Учебник",
  dictionary: "Словарь",
  book: "Книга",
  workbook: "Рабочая тетрадь",
  flashcards: "Карточки",
};

export default function AdminLibrary() {
  const [data, setData] = useState<AdminList<AdminLibraryItem> | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminLibraryPayload>(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setData(await getAdminLibrary(search, page));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const reset = () => {
    setEditingId(null);
    setForm(EMPTY);
    setFormError("");
  };

  const edit = (item: AdminLibraryItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      author: item.author ?? "",
      type: item.type,
      description: item.description ?? "",
      cover_path: item.cover_path ?? "",
      file_path: item.file_path ?? "",
      level: item.level ?? "",
      language: item.language ?? "ko",
      pages: item.pages,
      year: item.year,
    });
    setFormError("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await saveAdminLibrary(editingId, form);
      reset();
      await load();
    } catch {
      setFormError("Не удалось сохранить материал.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: AdminLibraryItem) => {
    if (!window.confirm(`Удалить «${item.title}»?`)) return;
    try {
      await deleteAdminLibrary(item.id);
      await load();
    } catch {
      setFormError("Не удалось удалить материал.");
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2>Библиотека</h2>
          <p>Книги, учебники, словари и PDF-материалы.</p>
        </div>
      </div>

      <form className="card admin-form admin-form--grid" onSubmit={submit}>
        <label className="admin-field admin-field--wide">
          <span>{editingId ? "Редактировать материал" : "Новый материал"}</span>
          <input
            className="input"
            placeholder="Название"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
        </label>
        <label className="admin-field">
          <span>Автор</span>
          <input
            className="input"
            value={form.author ?? ""}
            onChange={(event) => setForm({ ...form, author: event.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>Тип</span>
          <select
            className="select"
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>Уровень</span>
          <input
            className="input"
            placeholder="A1"
            value={form.level ?? ""}
            onChange={(event) => setForm({ ...form, level: event.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>Язык</span>
          <select
            className="select"
            value={form.language ?? "ko"}
            onChange={(event) =>
              setForm({ ...form, language: event.target.value })
            }
          >
            <option value="ko">Корейский</option>
            <option value="ru">Русский</option>
            <option value="mixed">Смешанный</option>
          </select>
        </label>
        <label className="admin-field">
          <span>Страниц</span>
          <input
            className="input"
            type="number"
            min={0}
            value={form.pages ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                pages: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </label>
        <label className="admin-field">
          <span>Год</span>
          <input
            className="input"
            type="number"
            min={0}
            max={2100}
            value={form.year ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                year: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </label>
        <label className="admin-field admin-field--wide">
          <span>Описание</span>
          <textarea
            className="input"
            rows={2}
            value={form.description ?? ""}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
          />
        </label>
        <label className="admin-field">
          <span>Путь к обложке</span>
          <input
            className="input"
            value={form.cover_path ?? ""}
            onChange={(event) =>
              setForm({ ...form, cover_path: event.target.value })
            }
          />
        </label>
        <label className="admin-field">
          <span>Путь к PDF</span>
          <input
            className="input"
            value={form.file_path ?? ""}
            onChange={(event) =>
              setForm({ ...form, file_path: event.target.value })
            }
          />
        </label>
        {formError && <p className="admin-error admin-field--wide">{formError}</p>}
        <div className="admin-form__actions admin-field--wide">
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

      <div className="admin-toolbar">
        <div className="input-wrap">
          <span className="input-wrap__icon">
            <Search size={17} />
          </span>
          <input
            className="input input--with-icon"
            placeholder="Поиск материала"
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
                  <th>Название</th>
                  <th>Тип</th>
                  <th>Уровень</th>
                  <th>Год</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.data.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title}</strong>
                      <small>{item.author ?? "—"}</small>
                    </td>
                    <td>{TYPE_LABELS[item.type] ?? item.type}</td>
                    <td>{item.level ?? "—"}</td>
                    <td>{item.year ?? "—"}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="btn btn--ghost btn--icon"
                          onClick={() => edit(item)}
                          aria-label="Редактировать"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost btn--icon"
                          onClick={() => void remove(item)}
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
        <StateBlock variant="empty" text="Материалов пока нет." />
      )}
    </div>
  );
}
