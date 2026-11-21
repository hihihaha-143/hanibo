import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "../../lib/motion";
import ChipsBlock from "../../components/ChipsBlock/ChipsBlock";
import type { PracticeTabId } from "./practiceTabs";
import { PRACTICE_TABS, DEFAULT_PRACTICE_TAB } from "./practiceTabs";
import AlphabetPage from "../AlphabetPage/AlphabetPage";
import { DictionaryTab } from "../DictionaryPage/DictionaryTab";
import { PhrasesTab } from "../PhrasesPage/PhrasesTab";
import { GrammarTab } from "../GrammarPage/GrammarTab";

const STORAGE_KEY = "hanibo.practice.tab";

function isPracticeTabId(value: string | null): value is PracticeTabId {
  return !!value && PRACTICE_TABS.some((tab) => tab.id === value);
}

function readStoredTab(): PracticeTabId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isPracticeTabId(stored)) return stored;
  } catch {
    // ignore
  }
  return DEFAULT_PRACTICE_TAB;
}

export default function PracticePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTab = searchParams.get("tab");
  const activeTab: PracticeTabId = isPracticeTabId(rawTab)
    ? rawTab
    : readStoredTab();

  const handleTabChange = (tabId: PracticeTabId) => {
    setSearchParams({ tab: tabId }, { replace: false });
    try {
      localStorage.setItem(STORAGE_KEY, tabId);
    } catch {
      // ignore
    }
  };

  return (
    <div className="practice-page">
      <header className="page__header practice-page__header">
        <h1 className="page__title">Практика</h1>
        <p className="practice-page__subtitle">
          Алфавит, слова, фразы и грамматика в одном месте
        </p>
      </header>

      <ChipsBlock
        tabs={PRACTICE_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        layoutId="practice-chip-highlight"
      />

      <div className="practice-page__content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            className="practice-page__panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={spring.soft}
          >
            {activeTab === "alphabet" ? (
              <AlphabetPage />
            ) : activeTab === "vocabulary" ? (
              <DictionaryTab />
            ) : activeTab === "phrases" ? (
              <PhrasesTab />
            ) : activeTab === "grammar" ? (
              <GrammarTab />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
