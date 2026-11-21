import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import StateBlock from "../../components/StateBlock/StateBlock";
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
  const navigate = useNavigate();
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
      return <StateBlock variant="loading" text="Загружаем алфавит…" />;
    }
    if (error) {
      return <StateBlock variant="error" text={error} />;
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
        return (
          <AssimilationBlock letters={letters} showProgress={showProgress} />
        );
      case "stats":
        return <StatsBlock letters={letters} />;
    }
  };

  const isLetterTab =
    activeTab === "vowels" ||
    activeTab === "consonants" ||
    activeTab === "diphthongs" ||
    activeTab === "assimilation";

  // маппинг табов в категории API
  const categoryMap: Record<string, string> = {
    vowels: "vowel",
    consonants: "consonant",
    diphthongs: "diphthong",
    assimilation: "assimilation",
  };

  return (
    <div className="alphabet-page">
      <header className="page__header alphabet-page__header">
        <h1 className="page__title">Алфавит</h1>
        <p className="alphabet-page__subtitle">
          Гласные, согласные, дифтонги и правила ассимиляции
        </p>
      </header>

      <div className="alphabet-page__top">
        <ChipsBlock
          tabs={ALPHABET_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          layoutId="alphabet-chip-highlight"
        />

        {isLetterTab && (
          <div className="alphabet-page__controls">
            <motion.button
              type="button"
              className="btn btn--accent"
              onClick={() =>
                navigate(`/alphabet/test/${categoryMap[activeTab]}`)
              }
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={spring.bouncy}
            >
              Пройти тест
            </motion.button>
            <motion.button
              type="button"
              className={`btn btn--outline${showProgress ? " btn--active" : ""}`}
              onClick={() => setShowProgress((v) => !v)}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={spring.bouncy}
            >
              {showProgress ? "Скрыть прогресс" : "Показать прогресс"}
            </motion.button>
          </div>
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
