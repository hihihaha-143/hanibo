import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCourseItemWords,
  getCourseItemGrammar,
  type CourseItemDetails,
  type CourseItemWord,
  type GrammarRule,
} from "../../../api/course";
import DictionaryTab from "./DictionaryTab/DictionaryTab";
import GrammarTab from "./GrammarTab/GrammarTab";
type Tab = "words" | "grammar" | "test";

interface LessonViewProps {
  item: CourseItemDetails;
}

export default function LessonView({ item }: LessonViewProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("words");

  const [words, setWords] = useState<CourseItemWord[] | null>(null);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [wordsError, setWordsError] = useState(false);

  const [grammar, setGrammar] = useState<GrammarRule[] | null>(null);
  const [grammarLoading, setGrammarLoading] = useState(true);
  const [grammarError, setGrammarError] = useState(false);

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

  const handleNext = () => {
    if (item.next) {
      navigate(`/course/item/${item.next.id}`);
    }
  };

  return (
    <div className="lesson-view">
      <Link to="/course" className="lesson-view__back">
        <ArrowLeft size={18} />
        <span>Назад к курсу</span>
      </Link>

      <h1 className="lesson-view__title">{item.title}</h1>

      <div className="lesson-view__tabs">
        <button
          type="button"
          className={`lesson-view__tab ${tab === "words" ? "lesson-view__tab--active" : ""}`}
          onClick={() => setTab("words")}
        >
          Словарь
        </button>
        <button
          type="button"
          className={`lesson-view__tab ${tab === "grammar" ? "lesson-view__tab--active" : ""}`}
          onClick={() => setTab("grammar")}
        >
          Грамматика
        </button>
        <button
          type="button"
          className={`lesson-view__tab ${tab === "test" ? "lesson-view__tab--active" : ""}`}
          onClick={() => setTab("test")}
        >
          Итоговый тест
        </button>
      </div>

      <div className="lesson-view__content">
        {tab === "words" && (
          <>
            {wordsLoading && <p>Загрузка...</p>}
            {wordsError && <p>Не удалось загрузить слова.</p>}
            {words && <DictionaryTab words={words} />}
          </>
        )}

        {tab === "grammar" && (
          <>
            {grammarLoading && <p>Загрузка...</p>}
            {grammarError && <p>Не удалось загрузить грамматику.</p>}
            {grammar && <GrammarTab rules={grammar} />}
          </>
        )}

        {tab === "test" && (
          <p className="lesson-view__placeholder">Итоговый тест — позже.</p>
        )}
      </div>

      {item.next && (
        <div className="lesson-view__footer">
          <button
            type="button"
            className="lesson-view__next"
            onClick={handleNext}
          >
            <span>{item.next.title}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
