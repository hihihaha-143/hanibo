import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  getGrammarRules,
  startGrammarRule,
  resetGrammarRule,
  type GrammarRule,
} from "../../api/grammar";
import { useAuth } from "../../context/useAuth";
import { GrammarRuleModal } from "./GrammarRuleModal";

function currentDayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

function pickDailyId(ids: number[], dayKey: string): number | null {
  if (ids.length === 0) return null;
  let hash = 0;
  for (let i = 0; i < dayKey.length; i++) {
    hash = (hash * 31 + dayKey.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % ids.length;
  return ids[idx];
}

export function DailyGrammarBlock() {
  const { refreshUser } = useAuth();
  const [rule, setRule] = useState<GrammarRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGrammarRules({ tab: "all", per_page: 200 })
      .then((res) => {
        if (cancelled) return;
        const id = pickDailyId(
          res.data.map((r) => r.id),
          currentDayKey(),
        );
        const found = res.data.find((r) => r.id === id) ?? null;
        setRule(found);
      })
      .catch(() => {
        if (!cancelled) setRule(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isStarted = rule ? rule.status !== "new" : false;

  const handleToggle = async () => {
    if (!rule || pending) return;
    setPending(true);
    try {
      if (isStarted) {
        await resetGrammarRule(rule.id);
        setRule({ ...rule, status: "new" });
      } else {
        await startGrammarRule(rule.id);
        setRule({ ...rule, status: "learning" });
      }
      await refreshUser();
    } catch {
      // молча
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return (
      <aside className="daily-word-block daily-word-block--state">
        <p className="daily-word-block__state-text">Загрузка правила дня…</p>
      </aside>
    );
  }

  if (!rule) return null;

  return (
    <aside className="daily-word-block">
      <div className="daily-word-block__head">
        <CalendarDays size={16} />
        <span className="daily-word-block__title">Правило дня</span>
      </div>

      <div className="daily-word-block__body">
        <button
          type="button"
          className="daily-word-block__hangul"
          style={{ textAlign: "left" }}
          onClick={() => setOpenModal(true)}
        >
          {rule.title}
        </button>
        <p className="daily-word-block__translation">{rule.construction}</p>
      </div>

      <button
        type="button"
        className={
          "btn btn--sm " +
          (isStarted ? "btn--outline" : "btn--accent") +
          " daily-word-block__action"
        }
        onClick={handleToggle}
        disabled={pending}
      >
        {pending ? "…" : isStarted ? "Сбросить" : "Начать учить"}
      </button>

      {openModal && (
        <GrammarRuleModal
          ruleId={rule.id}
          onClose={() => setOpenModal(false)}
          onChanged={() => {
            getGrammarRules({ tab: "all", per_page: 200 })
              .then((res) => {
                const found = res.data.find((r) => r.id === rule.id);
                if (found) setRule(found);
              })
              .catch(() => {});
          }}
        />
      )}
    </aside>
  );
}
