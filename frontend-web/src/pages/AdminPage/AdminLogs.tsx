import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getAdminLogs } from "../../api/admin";
import StateBlock from "../../components/StateBlock/StateBlock";

export default function AdminLogs() {
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setLines(await getAdminLogs());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2>Логи</h2>
          <p>Последние 200 строк laravel.log.</p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => void load()}
        >
          <RefreshCw size={15} />
          Обновить
        </button>
      </div>

      {loading ? (
        <StateBlock variant="loading" />
      ) : error ? (
        <StateBlock variant="error" onRetry={load} />
      ) : (
        <pre className="admin-logs">{lines.join("\n") || "Логов пока нет."}</pre>
      )}
    </div>
  );
}
