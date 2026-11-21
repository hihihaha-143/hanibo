import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import {
  getAdminUsers,
  resetAdminUserProgress,
  setAdminUserRole,
  type AdminUser,
} from "../../api/admin";
import StateBlock from "../../components/StateBlock/StateBlock";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionError, setActionError] = useState("");
  const [pending, setPending] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAdminUsers(search, page);
      setUsers(data.data);
      setLastPage(data.meta.last_page);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const changeRole = async (user: AdminUser, role: "user" | "admin") => {
    setActionError("");
    setPending(user.id);
    try {
      const updated = await setAdminUserRole(user.id, role);
      setUsers((previous) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch {
      setActionError("Не удалось изменить роль.");
    } finally {
      setPending(null);
    }
  };

  const resetProgress = async (user: AdminUser) => {
    if (!window.confirm(`Сбросить прогресс пользователя ${user.nickname}?`)) {
      return;
    }
    setActionError("");
    setPending(user.id);
    try {
      await resetAdminUserProgress(user.id);
      await load();
    } catch {
      setActionError("Не удалось сбросить прогресс.");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2>Пользователи</h2>
          <p>Поиск, роли и сброс прогресса.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="input-wrap">
          <span className="input-wrap__icon">
            <Search size={17} />
          </span>
          <input
            className="input input--with-icon"
            placeholder="Ник или email"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {actionError && <p className="admin-error">{actionError}</p>}
      {loading ? (
        <StateBlock variant="loading" />
      ) : error ? (
        <StateBlock variant="error" onRetry={load} />
      ) : users.length === 0 ? (
        <StateBlock variant="empty" text="Пользователи не найдены." />
      ) : (
        <>
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Уровень</th>
                  <th>Серия</th>
                  <th>Валюта</th>
                  <th>Роль</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.nickname}</strong>
                      <small>#{user.id}</small>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.language_level ?? "—"}</td>
                    <td>{user.streak_current}</td>
                    <td>
                      {user.blueberry} 🫐 / {user.strawberry} 🍓
                    </td>
                    <td>
                      <select
                        className="select"
                        value={user.role}
                        disabled={pending === user.id}
                        onChange={(event) =>
                          void changeRole(
                            user,
                            event.target.value as "user" | "admin",
                          )
                        }
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        disabled={pending === user.id}
                        onClick={() => void resetProgress(user)}
                        title="Сбросить прогресс"
                      >
                        <RotateCcw size={14} />
                        Сброс
                      </button>
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
              {page} / {lastPage}
            </span>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              disabled={page >= lastPage}
              onClick={() => setPage((value) => value + 1)}
            >
              Вперёд
            </button>
          </div>
        </>
      )}
    </div>
  );
}
