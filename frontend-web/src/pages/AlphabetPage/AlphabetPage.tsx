import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "../../lib/motion";
import ChipsBlock from "../../components/ChipsBlock/ChipsBlock";
import type { AlphabetTabId } from "./alphabetTabs";
import {
  ALPHABET_TABS,
  DEFAULT_ALPHABET_TAB,
  isAlphabetTabId,
} from "./alphabetTabs";
import { useAlphabet } from "./useAlphabet";
import VowelsBlock from "./VowelsBlock";
import ConsonantsBlock from "./ConsonantsBlock";
import DiphthongsBlock from "./DiphthongsBlock";
import AssimilationBlock from "./AssimilationBlock";
import StatsBlock from "./StatsBlock";

const STORAGE_KEY = "hanibo.alphabet.sub";

function readStoredTab(): AlphabetTabId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isAlphabetTabId(stored)) return stored;
  } catch {
    // ignore
  }
  return DEFAULT_ALPHABET_TAB;
}

export default function AlphabetPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { letters, loading, error } = useAlphabet();

  const rawSub = searchParams.get("sub");
  const activeTab: AlphabetTabId = isAlphabetTabId(rawSub)
    ? rawSub
    : readStoredTab();

  const handleTabChange = (tabId: AlphabetTabId) => {
    const next = new URLSearchParams(searchParams);
    next.set("sub", tabId);
    setSearchParams(next, { replace: false });
    try {
      localStorage.setItem(STORAGE_KEY, tabId);
    } catch {
      // ignore
    }
  };

  const renderTab = () => {
    if (loading) {
      return <p className="alphabet-page__status">Загрузка…</p>;
    }
    if (error) {
      return (
        <p className="alphabet-page__status alphabet-page__status--error">
          {error}
        </p>
      );
    }

    switch (activeTab) {
      case "vowels":
        return <VowelsBlock letters={letters} />;
      case "consonants":
        return <ConsonantsBlock letters={letters} />;
      case "diphthongs":
        return <DiphthongsBlock letters={letters} />;
      case "assimilation":
        return <AssimilationBlock />;
      case "stats":
        return <StatsBlock />;
    }
  };

  return (
    <div className="alphabet-page">
      <ChipsBlock
        tabs={ALPHABET_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        layoutId="alphabet-chip-highlight"
      />

      <div className="alphabet-page__content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            className="alphabet-page__panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={spring.soft}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
