import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPhrases,
  getTopics,
  type DictionaryPhrase,
  type DictionaryTab as DictionaryTabId,
  type Paginated,
  type PhraseProgress,
} from "../../api/dictionary";
import type { Topic } from "../../api/course";
import { PhrasesToolbarBlock } from "./PhrasesToolbarBlock";
import { PhrasesGridBlock } from "./PhrasesGridBlock";
import { DailyPhraseBlock } from "./DailyPhraseBlock";
import { DailyPhraseQuizBlock } from "./DailyPhraseQuizBlock";
import { MiniGamesModal } from "../DictionaryPage/MiniGame/MiniGamesModal";
import {
  PHRASE_MINI_GAMES,
  type PhraseMiniGameId,
} from "../DictionaryPage/MiniGame/miniGamesData";
import { PhraseTrueFalseGame } from "./PhraseMiniGame/PhraseTrueFalseGame";
import { PhraseAudioChooseGame } from "./PhraseMiniGame/PhraseAudioChooseGame";
import { PhraseMatchGame } from "./PhraseMiniGame/PhraseMatchGame";
import { PhraseSpeedGame } from "./PhraseMiniGame/PhraseSpeedGame";
import { PhraseCorrectSpellingGame } from "./PhraseMiniGame/PhraseCorrectSpellingGame";
import { PhraseOrderGame } from "./PhraseMiniGame/PhraseOrderGame";

const EMPTY_PAGE: Paginated<DictionaryPhrase> = {
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

export function PhrasesTab() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tab, setTab] = useState<DictionaryTabId>("all");
  const [topicId, setTopicId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [phrases, setPhrases] =
    useState<Paginated<DictionaryPhrase>>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [miniGamesOpen, setMiniGamesOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<PhraseMiniGameId | null>(null);

  const [now, setNow] = useState<number>(() => Date.now());

  const [reloadTick, setReloadTick] = useState(0);
  const requestIdRef = useRef(0);

  const reloadPhrases = useCallback(() => {
    setReloadTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), NOW_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const handleReset = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setTab("all");
    setTopicId(null);
    setPage(1);
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

    getPhrases({
      search: debouncedSearch || undefined,
      topic_id: topicId,
      tab,
      page,
    })
      .then((res) => {
        if (id !== requestIdRef.current) return;
        setPhrases(res);
      })
      .catch(() => {
        if (id !== requestIdRef.current) return;
        setError("Не удалось загрузить фразы");
        setPhrases(EMPTY_PAGE);
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
    (phraseId: number, progress: PhraseProgress | null) => {
      setPhrases((prev) => {
        const nextData = prev.data.map((phrase) =>
          phrase.id === phraseId ? { ...phrase, progress } : phrase,
        );

        if (tab !== "all" && progress === null) {
          return {
            ...prev,
            data: nextData.filter((phrase) => phrase.id !== phraseId),
            meta: { ...prev.meta, total: Math.max(0, prev.meta.total - 1) },
          };
        }

        return { ...prev, data: nextData };
      });
    },
    [tab],
  );

  const handlePlay = useCallback((id: PhraseMiniGameId) => {
    setActiveGame(id);
  }, []);

  const handleExitGame = useCallback(() => {
    setActiveGame(null);
    reloadPhrases();
  }, [reloadPhrases]);

  const handleCloseModal = useCallback(() => {
    setMiniGamesOpen(false);
    setActiveGame(null);
    reloadPhrases();
  }, [reloadPhrases]);

  return (
    <div className="dictionary-tab">
      <div className="dictionary-tab__head">
        <p className="dictionary-tab__count">
          {loading && phrases.meta.total === 0
            ? "загрузка…"
            : `${phrases.meta.total} фраз`}
        </p>
      </div>

      <PhrasesToolbarBlock
        search={searchInput}
        onSearchChange={setSearchInput}
        tab={tab}
        onTabChange={handleTabChange}
        topics={topics}
        topicId={topicId}
        onTopicChange={handleTopicChange}
        onOpenMiniGames={() => setMiniGamesOpen(true)}
        onReset={handleReset}
        hasFilters={
          searchInput.trim() !== "" || tab !== "all" || topicId !== null
        }
      />

      <div className="dictionary-tab__body">
        <div className="dictionary-tab__aside">
          <DailyPhraseBlock />
          <DailyPhraseQuizBlock
            disabled={miniGamesOpen}
            onAnswered={reloadPhrases}
          />
        </div>

        <div className="dictionary-tab__main">
          <PhrasesGridBlock
            phrases={phrases.data}
            loading={loading}
            error={error}
            currentPage={phrases.meta.current_page}
            lastPage={phrases.meta.last_page}
            now={now}
            onRetry={reloadPhrases}
            onPageChange={handlePageChange}
            onProgressChange={handleProgressChange}
          />
        </div>
      </div>

      <MiniGamesModal<PhraseMiniGameId>
        open={miniGamesOpen}
        onClose={handleCloseModal}
        activeGame={activeGame}
        onPlay={handlePlay}
        onExitGame={handleExitGame}
        games={PHRASE_MINI_GAMES}
        title="Мини-игры: фразы"
      >
        {activeGame === "phrase-true-false" && (
          <PhraseTrueFalseGame onClose={handleExitGame} />
        )}
        {activeGame === "phrase-audio-choose" && (
          <PhraseAudioChooseGame onClose={handleExitGame} />
        )}
        {activeGame === "phrase-match" && (
          <PhraseMatchGame onClose={handleExitGame} />
        )}
        {activeGame === "phrase-speed" && (
          <PhraseSpeedGame onClose={handleExitGame} />
        )}
        {activeGame === "phrase-correct-spelling" && (
          <PhraseCorrectSpellingGame onClose={handleExitGame} />
        )}
        {activeGame === "phrase-order" && (
          <PhraseOrderGame onClose={handleExitGame} />
        )}
      </MiniGamesModal>
    </div>
  );
}
