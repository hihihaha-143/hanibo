import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDictionary,
  getTopics,
  type DictionaryTab as DictionaryTabId,
  type DictionaryWord,
  type Paginated,
  type WordProgress,
} from "../../api/dictionary";
import type { Topic } from "../../api/course";
import { DictionaryToolbarBlock } from "./DictionaryToolbarBlock";
import { DictionaryGridBlock } from "./DictionaryGridBlock";
import { DailyWordBlock } from "./DailyWordBlock";
import { DailyQuizBlock } from "./DailyQuizBlock";
import { MiniGamesModal, type MiniGameId } from "./MiniGame/MiniGamesModal";
import { TrueFalseGame } from "./MiniGame/TrueFalseGame";
import { AudioChooseGame } from "./MiniGame/AudioChooseGame";
import { MatchGame } from "./MiniGame/MatchGame";
import { SyllableGapGame } from "./MiniGame/SyllableGapGame";

const EMPTY_PAGE: Paginated<DictionaryWord> = {
  data: [],
  links: { first: null, last: null, prev: null, next: null },
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 30,
    total: 0,
    from: null,
    to: null,
  },
};

const NOW_TICK_MS = 30_000;

export function DictionaryTab() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tab, setTab] = useState<DictionaryTabId>("all");
  const [topicId, setTopicId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [words, setWords] = useState<Paginated<DictionaryWord>>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [miniGamesOpen, setMiniGamesOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<MiniGameId | null>(null);

  const [now, setNow] = useState<number>(() => Date.now());

  const [reloadTick, setReloadTick] = useState(0);
  const requestIdRef = useRef(0);

  const reloadWords = useCallback(() => {
    setReloadTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), NOW_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    getTopics()
      .then((list) => {
        if (!cancelled) setTopics(list);
      })
      .catch(() => {
        if (!cancelled) setTopics([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    getDictionary({
      search: debouncedSearch || undefined,
      topic_id: topicId,
      tab,
      page,
    })
      .then((res) => {
        if (id !== requestIdRef.current) return;
        setWords(res);
      })
      .catch(() => {
        if (id !== requestIdRef.current) return;
        setError("Не удалось загрузить словарь");
        setWords(EMPTY_PAGE);
      })
      .finally(() => {
        if (id !== requestIdRef.current) return;
        setLoading(false);
      });
  }, [debouncedSearch, topicId, tab, page, reloadTick]);

  const handleTabChange = useCallback((next: DictionaryTabId) => {
    setTab(next);
    setPage(1);
  }, []);

  const handleTopicChange = useCallback((id: number | null) => {
    setTopicId(id);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleProgressChange = useCallback(
    (wordId: number, progress: WordProgress | null) => {
      setWords((prev) => {
        const nextData = prev.data.map((word) =>
          word.id === wordId ? { ...word, progress } : word,
        );

        if (tab !== "all" && progress === null) {
          return {
            ...prev,
            data: nextData.filter((word) => word.id !== wordId),
            meta: { ...prev.meta, total: Math.max(0, prev.meta.total - 1) },
          };
        }

        return { ...prev, data: nextData };
      });
    },
    [tab],
  );

  const handlePlay = useCallback((id: MiniGameId) => {
    setActiveGame(id);
  }, []);

  const handleExitGame = useCallback(() => {
    setActiveGame(null);
    reloadWords();
  }, [reloadWords]);

  const handleCloseModal = useCallback(() => {
    setMiniGamesOpen(false);
    setActiveGame(null);
    reloadWords();
  }, [reloadWords]);

  return (
    <div className="dictionary-tab">
      <div className="dictionary-tab__head">
        <h2 className="dictionary-tab__title">Словарь</h2>
        <p className="dictionary-tab__count">
          {loading && words.meta.total === 0
            ? "загрузка…"
            : `${words.meta.total} слов`}
        </p>
      </div>

      <DictionaryToolbarBlock
        search={searchInput}
        onSearchChange={setSearchInput}
        tab={tab}
        onTabChange={handleTabChange}
        topics={topics}
        topicId={topicId}
        onTopicChange={handleTopicChange}
        onOpenMiniGames={() => setMiniGamesOpen(true)}
      />

      <div className="dictionary-tab__body">
        <div className="dictionary-tab__aside">
          <DailyWordBlock />
          <DailyQuizBlock disabled={miniGamesOpen} onAnswered={reloadWords} />
        </div>

        <div className="dictionary-tab__main">
          <DictionaryGridBlock
            words={words.data}
            loading={loading}
            error={error}
            currentPage={words.meta.current_page}
            lastPage={words.meta.last_page}
            now={now}
            onPageChange={handlePageChange}
            onProgressChange={handleProgressChange}
          />
        </div>
      </div>

      <MiniGamesModal
        open={miniGamesOpen}
        onClose={handleCloseModal}
        activeGame={activeGame}
        onPlay={handlePlay}
        onExitGame={handleExitGame}
      >
        {activeGame === "true-false" && (
          <TrueFalseGame onClose={handleExitGame} />
        )}
        {activeGame === "audio-choose" && (
          <AudioChooseGame onClose={handleExitGame} />
        )}
        {activeGame === "match" && <MatchGame onClose={handleExitGame} />}
        {activeGame === "syllable-gap" && (
          <SyllableGapGame onClose={handleExitGame} />
        )}
      </MiniGamesModal>
    </div>
  );
}
