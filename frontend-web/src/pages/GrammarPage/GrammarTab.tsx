import { useCallback, useEffect, useRef, useState } from "react";
import {
  getGrammarFilters,
  getGrammarRules,
  type GrammarFilters,
  type GrammarRule,
  type GrammarTabId,
  type Paginated,
} from "../../api/grammar";
import { GrammarToolbarBlock } from "./GrammarToolbarBlock";
import { GrammarGridBlock } from "./GrammarGridBlock";
import { GrammarRuleModal } from "./GrammarRuleModal";
import { DailyGrammarBlock } from "./DailyGrammarBlock";
import { DailyGrammarQuizBlock } from "./DailyGrammarQuizBlock";

const EMPTY_PAGE: Paginated<GrammarRule> = {
  data: [],
  links: { first: null, last: null, prev: null, next: null },
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
    from: null,
    to: null,
  },
};

export function GrammarTab() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tab, setTab] = useState<GrammarTabId>("all");
  const [formId, setFormId] = useState<number | null>(null);
  const [levelId, setLevelId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<GrammarFilters>({
    forms: [],
    levels: [],
  });
  const [rules, setRules] = useState<Paginated<GrammarRule>>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openRuleId, setOpenRuleId] = useState<number | null>(null);
  const [reloadTick, setReloadTick] = useState(0);
  const requestIdRef = useRef(0);

  const reload = useCallback(() => setReloadTick((t) => t + 1), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    getGrammarFilters()
      .then((res) => {
        if (!cancelled) setFilters(res);
      })
      .catch(() => {
        if (!cancelled) setFilters({ forms: [], levels: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    getGrammarRules({
      search: debouncedSearch || undefined,
      form_id: formId,
      level_id: levelId,
      tab,
      page,
    })
      .then((res) => {
        if (id !== requestIdRef.current) return;
        setRules(res);
      })
      .catch(() => {
        if (id !== requestIdRef.current) return;
        setError("Не удалось загрузить грамматику");
        setRules(EMPTY_PAGE);
      })
      .finally(() => {
        if (id !== requestIdRef.current) return;
        setLoading(false);
      });
  }, [debouncedSearch, tab, formId, levelId, page, reloadTick]);

  const handleTabChange = useCallback((next: GrammarTabId) => {
    setTab(next);
    setPage(1);
  }, []);

  const handleFormChange = useCallback((id: number | null) => {
    setFormId(id);
    setPage(1);
  }, []);

  const handleLevelChange = useCallback((id: number | null) => {
    setLevelId(id);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="dictionary-tab">
      <div className="dictionary-tab__head">
        <p className="dictionary-tab__count">
          {loading && rules.meta.total === 0
            ? "загрузка…"
            : `${rules.meta.total} правил`}
        </p>
      </div>

      <GrammarToolbarBlock
        search={searchInput}
        onSearchChange={setSearchInput}
        tab={tab}
        onTabChange={handleTabChange}
        forms={filters.forms}
        formId={formId}
        onFormChange={handleFormChange}
        levels={filters.levels}
        levelId={levelId}
        onLevelChange={handleLevelChange}
        onOpenMiniGames={() => {
          // подключим на шаге 6
        }}
      />

      <div className="dictionary-tab__body">
        <div className="dictionary-tab__aside">
          <DailyGrammarBlock />
          <DailyGrammarQuizBlock onAnswered={reload} />
        </div>

        <div className="dictionary-tab__main">
          <GrammarGridBlock
            rules={rules.data}
            loading={loading}
            error={error}
            currentPage={rules.meta.current_page}
            lastPage={rules.meta.last_page}
            onPageChange={handlePageChange}
            onOpen={setOpenRuleId}
          />
        </div>
      </div>

      {openRuleId !== null && (
        <GrammarRuleModal
          ruleId={openRuleId}
          onClose={() => setOpenRuleId(null)}
          onChanged={reload}
        />
      )}
    </div>
  );
}
