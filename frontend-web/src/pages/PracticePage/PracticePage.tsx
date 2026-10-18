import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "../../lib/motion";
import PracticeChipsBlock from "./PracticeChipsBlock";
import type { PracticeTabId } from "./practiceTabs";
import { PRACTICE_TABS, DEFAULT_PRACTICE_TAB } from "./practiceTabs";

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
      <PracticeChipsBlock
        tabs={PRACTICE_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
            <p className="practice-page__placeholder">Раздел в разработке</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
