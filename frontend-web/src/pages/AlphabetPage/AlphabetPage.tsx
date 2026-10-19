// frontend-web/src/pages/AlphabetPage/AlphabetPage.tsx

import { useState } from "react";
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
  const [showProgress, setShowProgress] = useState(false);

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
        return <VowelsBlock letters={letters} showProgress={showProgress} />;
      case "consonants":
        return (
          <ConsonantsBlock letters={letters} showProgress={showProgress} />
        );
      case "diphthongs":
        return (
          <DiphthongsBlock letters={letters} showProgress={showProgress} />
        );
      case "assimilation":
        return <AssimilationBlock />;
      case "stats":
        return <StatsBlock />;
    }
  };

  const isLetterTab =
    activeTab === "vowels" ||
    activeTab === "consonants" ||
    activeTab === "diphthongs";

  return (
    <div className="alphabet-page">
      <div className="alphabet-page__top">
        <ChipsBlock
          tabs={ALPHABET_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          layoutId="alphabet-chip-highlight"
        />

        {isLetterTab && (
          <motion.button
            type="button"
            className={`alphabet-page__progress-toggle${
              showProgress ? " alphabet-page__progress-toggle--active" : ""
            }`}
            onClick={() => setShowProgress((v) => !v)}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            {showProgress ? "Скрыть прогресс" : "Показать прогресс"}
          </motion.button>
        )}
      </div>

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
