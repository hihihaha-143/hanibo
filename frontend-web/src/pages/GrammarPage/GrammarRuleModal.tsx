import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  getGrammarRule,
  getGrammarRules,
  startGrammarRule,
  resetGrammarRule,
  type GrammarRule,
  type GrammarRuleDetail,
} from "../../api/grammar";
import { useAuth } from "../../context/useAuth";
import SpeakControls from "../../components/SpeakButton/SpeakControls";

interface GrammarRuleModalProps {
  ruleId: number;
  onClose: () => void;
  onChanged: () => void;
}

export function GrammarRuleModal({
  ruleId,
  onClose,
  onChanged,
}: GrammarRuleModalProps) {
  const { refreshUser } = useAuth();

  const [rule, setRule] = useState<GrammarRuleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const [allIds, setAllIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number>(ruleId);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const loadedAllRef = useRef(false);

  useEffect(() => {
    if (loadedAllRef.current) return;
    loadedAllRef.current = true;

    getGrammarRules({ tab: "all", per_page: 200 })
      .then((res) => {
        setAllIds(res.data.map((r: GrammarRule) => r.id));
      })
      .catch(() => {
        setAllIds([]);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGrammarRule(activeId)
      .then((res) => {
        if (!cancelled) setRule(res);
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
  }, [activeId]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const goPrev = useCallback(() => {
    if (allIds.length === 0) return;
    const idx = allIds.indexOf(activeId);
    const prev = idx <= 0 ? allIds[allIds.length - 1] : allIds[idx - 1];
    setActiveId(prev);
  }, [allIds, activeId]);

  const goNext = useCallback(() => {
    if (allIds.length === 0) return;
    const idx = allIds.indexOf(activeId);
    const next =
      idx === -1 || idx === allIds.length - 1 ? allIds[0] : allIds[idx + 1];
    setActiveId(next);
  }, [allIds, activeId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  const isStarted = rule ? rule.status !== "new" : false;

  const handleToggle = async () => {
    if (!rule || pending) return;
    setPending(true);
    try {
      if (isStarted) {
        await resetGrammarRule(rule.id);
        setRule({
          ...rule,
          status: "new",
          interval_days: null,
          next_review_at: null,
          correct_streak: null,
          mistakes_count: null,
        });
      } else {
        await startGrammarRule(rule.id);
        setRule({
          ...rule,
          status: "learning",
          interval_days: 0,
          next_review_at: null,
          correct_streak: 0,
          mistakes_count: 0,
        });
      }
      await refreshUser();
      onChanged();
    } catch {
      // молча
    } finally {
      setPending(false);
    }
  };

  const canNavigate = allIds.length > 1;

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal__panel grammar-rule-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X size={18} />
        </button>

        <header className="grammar-rule-modal__head">
          <div className="grammar-rule-modal__nav-row">
            <button
              type="button"
              className="grammar-rule-modal__nav"
              onClick={goPrev}
              disabled={!canNavigate}
              aria-label="Предыдущее правило"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="grammar-rule-modal__nav"
              onClick={goNext}
              disabled={!canNavigate}
              aria-label="Следующее правило"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grammar-rule-modal__heading">
            {loading && !rule && (
              <p className="state-block__text">Загрузка правила…</p>
            )}

            {!loading && !rule && (
              <p className="state-block__text text-error">
                Не удалось загрузить правило
              </p>
            )}

            {rule && (
              <>
                <h2 className="grammar-rule-modal__title">{rule.title}</h2>
                <p className="grammar-rule-modal__construction">
                  {rule.construction}
                </p>

                {(rule.form || rule.level) && (
                  <div className="dictionary-card__meta">
                    {rule.form && (
                      <span className="dictionary-card__chip dictionary-card__chip--pos">
                        {rule.form.title}
                      </span>
                    )}
                    {rule.level && (
                      <span className="dictionary-card__chip dictionary-card__chip--level">
                        {rule.level.title}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </header>

        {rule && (
          <>
            {(rule.phrases?.length ?? 0) > 0 && (
              <section>
                <h3 className="daily-quiz-block__title">Примеры</h3>
                <ul className="grammar-rule-modal__phrases">
                  {rule.phrases.map((p) => (
                    <li key={p.id} className="dictionary-card__example">
                      <div className="grammar-rule-modal__phrase-row">
                        <p className="dictionary-card__example-hangul">
                          {p.hangul}
                        </p>
                        <SpeakControls
                          text={p.hangul}
                          className="grammar-rule-modal__speak"
                        />
                      </div>
                      <p className="dictionary-card__example-translation">
                        {p.translation}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(rule.lessons?.length ?? 0) > 0 && (
              <section>
                <h3 className="daily-quiz-block__title">Уроки</h3>
                <ul className="grammar-rule-modal__lessons">
                  {rule.lessons.map((l) => (
                    <li
                      key={l.id}
                      className="dictionary-card__chip dictionary-card__chip--topic"
                    >
                      {l.title ?? `Урок ${l.order}`}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <footer className="grammar-rule-modal__footer">
              <button
                type="button"
                className={
                  "btn " + (isStarted ? "btn--outline" : "btn--accent")
                }
                onClick={handleToggle}
                disabled={pending}
              >
                {pending ? "…" : isStarted ? "Сбросить" : "Начать учить"}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
