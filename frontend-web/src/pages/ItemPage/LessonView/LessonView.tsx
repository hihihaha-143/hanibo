import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
import { getLessonProgress, PASS_THRESHOLD } from "../../../utils/progress";
import DictionaryTab from "./DictionaryTab/DictionaryTab";
import GrammarTab from "./GrammarTab/GrammarTab";
import FinalTestTab from "./FinalTestTab";
import { spring } from "../../../lib/motion";

const MotionLink = motion.create(Link);

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
    if (!(progress.grammarPercent > PASS_THRESHOLD)) return;
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

  const grammarLocked = !(progress.wordsPercent > PASS_THRESHOLD);
  const finalLocked = !(progress.grammarPercent > PASS_THRESHOLD);

  const lockedMap: Record<Tab, boolean> = {
    words: false,
    grammar: grammarLocked,
    test: finalLocked,
  };

  return (
    <div className="lesson-view">
      <MotionLink
        to="/course"
        className="lesson-view__back"
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={spring.bouncy}
      >
        <ArrowLeft size={18} />
        <span>Назад к курсу</span>
      </MotionLink>

      <h1 className="lesson-view__title">{item.title}</h1>

      <div className="lesson-view__tabs">
        {TABS.map(({ id, label }) => {
          const isActive = tab === id;
          const isLocked = lockedMap[id];
          return (
            <motion.button
              key={id}
              type="button"
              className={`lesson-view__tab${isActive ? " lesson-view__tab--active" : ""}${isLocked ? " lesson-view__tab--locked" : ""}`}
              onClick={() => {
                if (isLocked) return;
                if (id === "test") goToFinalTest();
                else setTab(id);
              }}
              disabled={isLocked}
              whileTap={isLocked ? undefined : { scale: 0.97 }}
              transition={spring.bouncy}
            >
              {label}
              {isActive && (
                <motion.span
                  className="lesson-view__tab-indicator"
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
            {wordsLoading && <p>Загрузка...</p>}
            {wordsError && <p>Не удалось загрузить слова.</p>}
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
            {grammarLoading && <p>Загрузка...</p>}
            {grammarError && <p>Не удалось загрузить грамматику.</p>}
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
              <FinalTestTab
                itemId={item.id}
                questions={finalQuestions}
                onRepeat={handleFinalRepeat}
                onBack={handleFinalBack}
                onNext={item.next ? handleFinalNext : undefined}
                nextLabel={item.next ? item.next.title : undefined}
              />
            ) : (
              <p>Загрузка...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
