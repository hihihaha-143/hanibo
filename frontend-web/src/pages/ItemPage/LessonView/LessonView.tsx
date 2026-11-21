import { requestAchievementSync } from "../../../lib/achievementStats";
import AchievementsStrip from "../../../components/AchievementsStrip/AchievementsStrip";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getCourseItemWords,
  getCourseItemGrammar,
  type CourseItemDetails,
  type CourseItemWord,
  type GrammarRule,
  type PhraseGrammarRule,
} from "../../../api/course";
import {
  generateFinalTest,
  type TestQuestion,
} from "../../../utils/testGenerator";
import {
  getLessonProgress,
  PASS_THRESHOLD,
  setFinalPercent,
} from "../../../utils/progress";
import DictionaryTab from "./DictionaryTab/DictionaryTab";
import GrammarTab from "./GrammarTab/GrammarTab";
import Test from "./Test/Test";
import BackLink from "../../../components/BackLink/BackLink";
import StateBlock from "../../../components/StateBlock/StateBlock";
import { spring } from "../../../lib/motion";

type Tab = "words" | "grammar" | "test";

interface LessonViewProps {
  item: CourseItemDetails;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "words", label: "Словарь" },
  { id: "grammar", label: "Грамматика" },
  { id: "test", label: "Итоговый тест" },
];

export default function LessonView({ item }: LessonViewProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("words");
  const [progress, setProgress] = useState(() => getLessonProgress(item.id));

  const [words, setWords] = useState<CourseItemWord[] | null>(null);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [wordsError, setWordsError] = useState(false);

  const [grammar, setGrammar] = useState<GrammarRule[] | null>(null);
  const [grammarPool, setGrammarPool] = useState<PhraseGrammarRule[]>([]);
  const [grammarLoading, setGrammarLoading] = useState(true);
  const [grammarError, setGrammarError] = useState(false);

  const [finalQuestions, setFinalQuestions] = useState<TestQuestion[] | null>(
    null,
  );

  useEffect(() => {
    setProgress(getLessonProgress(item.id));
  }, [item.id]);

  useEffect(() => {
    const loadWords = async () => {
      try {
        const data = await getCourseItemWords(item.id);
        setWords(data.words);
      } catch (e) {
        console.error("Не удалось загрузить слова:", e);
        setWordsError(true);
      } finally {
        setWordsLoading(false);
      }
    };

    const loadGrammar = async () => {
      try {
        const data = await getCourseItemGrammar(item.id);
        setGrammar(data.grammar);
        setGrammarPool(data.pool ?? []);
      } catch (e) {
        console.error("Не удалось загрузить грамматику:", e);
        setGrammarError(true);
      } finally {
        setGrammarLoading(false);
      }
    };

    loadWords();
    loadGrammar();
  }, [item.id]);

  const refreshProgress = () => {
    setProgress(getLessonProgress(item.id));
  };

  const goToFinalTest = () => {
    if (!(progress.grammarPercent >= PASS_THRESHOLD)) return;
    if (!finalQuestions && words && grammar) {
      const q = generateFinalTest(words, grammar, grammarPool);
      setFinalQuestions(q);
    }
    setTab("test");
  };

  const handleFinalRepeat = () => {
    if (words && grammar) {
      setFinalQuestions(generateFinalTest(words, grammar, grammarPool));
    }
  };

  const handleFinalBack = () => navigate("/course");

  const handleFinalNext = () => {
    if (item.next) navigate(`/course/item/${item.next.id}`);
  };

  const grammarLocked = !(progress.wordsPercent >= PASS_THRESHOLD);
  const finalLocked = !(progress.grammarPercent >= PASS_THRESHOLD);

  const lockedMap: Record<Tab, boolean> = {
    words: false,
    grammar: grammarLocked,
    test: finalLocked,
  };

  const lockHint = (id: Tab): string | undefined => {
    if (!lockedMap[id]) return undefined;
    if (id === "grammar") return "Сначала пройдите тест по словарю";
    if (id === "test") return "Сначала пройдите тест по грамматике";
    return undefined;
  };

  return (
    <div className="page lesson-view">
      <BackLink to="/course">Назад к курсу</BackLink>

      <header className="page__header">
        <h1 className="page__title">{item.title}</h1>
      </header>

      <AchievementsStrip categoryCode="course" />

      <div className="tabs" role="tablist" aria-label="Разделы урока">
        {TABS.map(({ id, label }) => {
          const isActive = tab === id;
          const isLocked = lockedMap[id];
          return (
            <motion.button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`tabs__tab${isActive ? " tabs__tab--active" : ""}${
                isLocked ? " tabs__tab--locked" : ""
              }`}
              onClick={() => {
                if (isLocked) return;
                if (id === "test") goToFinalTest();
                else setTab(id);
              }}
              disabled={isLocked}
              title={lockHint(id)}
              whileTap={isLocked ? undefined : { scale: 0.97 }}
              transition={spring.bouncy}
            >
              {label}
              {isActive && (
                <motion.span
                  className="tabs__indicator"
                  layoutId="lesson-tab-indicator"
                  transition={spring.bouncy}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="lesson-view__content">
        {tab === "words" && (
          <>
            {wordsLoading && (
              <StateBlock variant="loading" text="Загружаем слова…" />
            )}
            {wordsError && (
              <StateBlock variant="error" text="Не удалось загрузить слова." />
            )}
            {words && (
              <DictionaryTab
                itemId={item.id}
                words={words}
                onGoToGrammar={() => {
                  refreshProgress();
                  setTab("grammar");
                }}
                onProgressChange={refreshProgress}
              />
            )}
          </>
        )}

        {tab === "grammar" && (
          <>
            {grammarLoading && (
              <StateBlock variant="loading" text="Загружаем грамматику…" />
            )}
            {grammarError && (
              <StateBlock
                variant="error"
                text="Не удалось загрузить грамматику."
              />
            )}
            {grammar && (
              <GrammarTab
                itemId={item.id}
                rules={grammar}
                pool={grammarPool}
                onGoToFinalTest={goToFinalTest}
                onProgressChange={refreshProgress}
              />
            )}
          </>
        )}

        {tab === "test" && (
          <>
            {finalQuestions ? (
              <Test
                questions={finalQuestions}
                onFinish={(correct, total) => {
                  const percent =
                    total > 0 ? Math.round((correct / total) * 100) : 0;
                  setFinalPercent(item.id, percent);
                  requestAchievementSync();
                  refreshProgress();
                }}
                onRepeat={handleFinalRepeat}
                onBack={handleFinalBack}
                backLabel="В курс"
                onNext={item.next ? handleFinalNext : undefined}
                nextLabel={item.next ? item.next.title : undefined}
              />
            ) : (
              <StateBlock variant="loading" text="Собираем итоговый тест…" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
