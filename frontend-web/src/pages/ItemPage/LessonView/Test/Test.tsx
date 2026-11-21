import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import type { TestQuestion } from "../../../../utils/testGenerator";
import { checkTextAnswer } from "../../../../utils/test/shared";
import ChooseQuestion from "./ChooseQuestion";
import ChooseGrammarQuestion from "./ChooseGrammarQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import TextInputQuestion from "./TextInputQuestion";
import MatchQuestion from "./MatchQuestion";
import FillBlankQuestion from "./FillBlankQuestion";
import WordOrderQuestion from "./WordOrderQuestion";
import AudioChooseQuestion from "./AudioChooseQuestion";
import CorrectSpellingQuestion from "./CorrectSpellingQuestion";
import FlashcardQuestion from "./FlashcardQuestion";
import SyllableGapQuestion from "./SyllableGapQuestion";
import TestResult from "./TestResult";
import StateBlock from "../../../../components/StateBlock/StateBlock";
import { spring } from "../../../../lib/motion";
import { PASS_THRESHOLD } from "../../../../utils/progress";

interface TestProps {
  questions: TestQuestion[];
  onFinish: (correct: number, total: number, passed: boolean) => void;
  onRepeat: () => void;
  onBack: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
  onAnswer?: (question: TestQuestion, isCorrect: boolean) => void;
}

export default function Test(props: TestProps) {
  const { questions, onBack, backLabel } = props;

  if (questions.length === 0) {
    return (
      <div className="test">
        <StateBlock variant="empty" text="Вопросы для этого теста не найдены." />
        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={onBack}>
            {backLabel ?? "Назад"}
          </button>
        </div>
      </div>
    );
  }

  return <TestRunner {...props} />;
}

function TestRunner({
  questions,
  onFinish,
  onRepeat,
  onBack,
  backLabel,
  onNext,
  nextLabel,
  onAnswer,
}: TestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<boolean | null>(null);
  const [textInputCorrect, setTextInputCorrect] = useState<boolean | null>(
    null,
  );
  const [fillBlankCorrect, setFillBlankCorrect] = useState<boolean | null>(
    null,
  );
  const [wordOrderCorrect, setWordOrderCorrect] = useState<boolean | null>(
    null,
  );
  const [syllableGapCorrect, setSyllableGapCorrect] = useState<boolean | null>(
    null,
  );
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const gradableTotal = questions.filter((q) => q.type !== "flashcard").length;

  const current = questions[currentIndex];

  const handleSelectIndex = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);

    let isCorrect = false;
    if (current.type === "correct-spelling") {
      isCorrect = index === current.correctIndex;
    } else if ("correctIndices" in current) {
      isCorrect = current.correctIndices.includes(index);
    }

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }
    onAnswer?.(current, isCorrect);
  };

  const handleSelectBoolean = (value: boolean) => {
    if (answered) return;
    setSelectedValue(value);
    setAnswered(true);
    if (current.type === "true-false") {
      const isCorrect = value === current.correct;
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
      }
      onAnswer?.(current, isCorrect);
    }
  };

  const handleSubmitText = (value: string) => {
    if (answered) return;
    if (current.type !== "text-input") return;
    const correct = checkTextAnswer(value, current.correctAnswer);
    setTextInputCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    onAnswer?.(current, correct);
  };

  const handleMatchSubmit = (correct: boolean) => {
    if (answered) return;
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    onAnswer?.(current, correct);
  };

  const handleFillBlankSelect = (index: number) => {
    if (answered) return;
    if (current.type !== "fill-blank" || current.mode !== "choice") return;
    const correct = index === current.correctIndex;
    setSelectedIndex(index);
    setFillBlankCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    onAnswer?.(current, correct);
  };

  const handleFillBlankSubmit = (value: string) => {
    if (answered) return;
    if (current.type !== "fill-blank" || current.mode !== "input") return;
    const correct = checkTextAnswer(value, current.correctAnswer);
    setFillBlankCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    onAnswer?.(current, correct);
  };

  const handleWordOrderSubmit = (correct: boolean) => {
    if (answered) return;
    setWordOrderCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    onAnswer?.(current, correct);
  };

  const handleSyllableGapSelect = (index: number) => {
    if (answered) return;
    if (current.type !== "syllable-gap" || current.mode !== "choice") return;
    const correct = index === current.correctIndex;
    setSelectedIndex(index);
    setSyllableGapCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    onAnswer?.(current, correct);
  };

  const handleSyllableGapSubmit = (value: string) => {
    if (answered) return;
    if (current.type !== "syllable-gap" || current.mode !== "input") return;
    const correct = checkTextAnswer(value, current.correctAnswer);
    setSyllableGapCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    onAnswer?.(current, correct);
  };

  const handleFlashcardAnswer = (known: boolean) => {
    if (answered) return;
    setAnswered(true);
    onAnswer?.(current, known);
  };

  const resetAnswerState = () => {
    setAnswered(false);
    setSelectedIndex(null);
    setSelectedValue(null);
    setTextInputCorrect(null);
    setFillBlankCorrect(null);
    setWordOrderCorrect(null);
    setSyllableGapCorrect(null);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      const percent =
        gradableTotal > 0 ? Math.round((correctCount / gradableTotal) * 100) : 0;
      const passed = percent >= PASS_THRESHOLD;
      setFinished(true);
      onFinish(correctCount, gradableTotal, passed);
    } else {
      setCurrentIndex((i) => i + 1);
      resetAnswerState();
    }
  };

  const handleRepeatInternal = () => {
    setCurrentIndex(0);
    resetAnswerState();
    setCorrectCount(0);
    setFinished(false);
    onRepeat();
  };

  // 1–4: выбор варианта для choose-подобных типов.
  useHotkeys(
    "1,2,3,4",
    (e) => {
      if (answered) return;
      const idx = parseInt(e.key, 10) - 1;
      if (idx < 0) return;

      if (current.type === "choose") {
        if (idx < current.variants.length) handleSelectIndex(idx);
      } else if (current.type === "choose-grammar") {
        if (idx < current.variants.length) handleSelectIndex(idx);
      } else if (current.type === "audio-choose") {
        if (idx < current.variants.length) handleSelectIndex(idx);
      } else if (current.type === "correct-spelling") {
        if (idx < current.variants.length) handleSelectIndex(idx);
      } else if (current.type === "fill-blank" && current.mode === "choice") {
        if (idx < current.variants.length) handleFillBlankSelect(idx);
      } else if (current.type === "syllable-gap" && current.mode === "choice") {
        if (idx < current.variants.length) handleSyllableGapSelect(idx);
      }
    },
    [current, answered],
  );

  // 1,2: верно/неверно.
  useHotkeys(
    "1,2",
    (e) => {
      if (answered) return;
      if (current.type !== "true-false") return;
      handleSelectBoolean(e.key === "1");
    },
    [current, answered],
  );

  // Enter: «Далее», когда ответ уже дан.
  useHotkeys(
    "enter",
    (e) => {
      if (!answered) return;
      if (current.type === "flashcard") return;
      e.preventDefault();
      handleNext();
    },
    [answered, current, correctCount, currentIndex],
  );

  if (finished) {
    const percent =
      gradableTotal > 0 ? Math.round((correctCount / gradableTotal) * 100) : 0;
    const passed = percent >= PASS_THRESHOLD;
    return (
      <TestResult
        correct={correctCount}
        total={gradableTotal}
        percent={percent}
        passed={passed}
        onRepeat={handleRepeatInternal}
        onBack={onBack}
        backLabel={backLabel}
        onNext={onNext}
        nextLabel={nextLabel}
      />
    );
  }

  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <div className="test">
      <div
        className="test__progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={currentIndex + 1}
        aria-label="Прогресс теста"
      >
        <motion.div
          className="test__progress-bar"
          animate={{ width: `${progressPercent}%` }}
          transition={spring.bouncy}
        />
      </div>

      <div className="test__counter" aria-live="polite">
        {currentIndex + 1} / {total}
      </div>

      <div className="test__question">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={spring.base}
          >
            {current.type === "choose" && (
              <ChooseQuestion
                question={current}
                selectedIndex={selectedIndex}
                answered={answered}
                onSelect={handleSelectIndex}
              />
            )}
            {current.type === "choose-grammar" && (
              <ChooseGrammarQuestion
                question={current}
                selectedIndex={selectedIndex}
                answered={answered}
                onSelect={handleSelectIndex}
              />
            )}
            {current.type === "true-false" && (
              <TrueFalseQuestion
                question={current}
                selectedValue={selectedValue}
                answered={answered}
                onSelect={handleSelectBoolean}
              />
            )}
            {current.type === "text-input" && (
              <TextInputQuestion
                question={current}
                answered={answered}
                isCorrect={textInputCorrect}
                onSubmit={handleSubmitText}
              />
            )}
            {current.type === "match" && (
              <MatchQuestion
                question={current}
                answered={answered}
                onSubmit={handleMatchSubmit}
              />
            )}
            {current.type === "fill-blank" && (
              <FillBlankQuestion
                question={current}
                answered={answered}
                isCorrect={fillBlankCorrect}
                selectedIndex={selectedIndex}
                onSelect={handleFillBlankSelect}
                onSubmit={handleFillBlankSubmit}
              />
            )}
            {current.type === "word-order" && (
              <WordOrderQuestion
                question={current}
                answered={answered}
                isCorrect={wordOrderCorrect}
                onSubmit={handleWordOrderSubmit}
              />
            )}
            {current.type === "audio-choose" && (
              <AudioChooseQuestion
                question={current}
                selectedIndex={selectedIndex}
                answered={answered}
                onSelect={handleSelectIndex}
              />
            )}
            {current.type === "correct-spelling" && (
              <CorrectSpellingQuestion
                question={current}
                selectedIndex={selectedIndex}
                answered={answered}
                onSelect={handleSelectIndex}
              />
            )}
            {current.type === "flashcard" && (
              <FlashcardQuestion
                question={current}
                onAnswer={handleFlashcardAnswer}
                onAutoNext={handleNext}
              />
            )}
            {current.type === "syllable-gap" && (
              <SyllableGapQuestion
                question={current}
                answered={answered}
                isCorrect={syllableGapCorrect}
                selectedIndex={selectedIndex}
                onSelect={handleSyllableGapSelect}
                onSubmit={handleSyllableGapSubmit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {answered && current.type !== "flashcard" && (
        <div className="actions">
          <motion.button
            type="button"
            className="btn btn--primary"
            onClick={handleNext}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={spring.bouncy}
          >
            Далее
          </motion.button>
        </div>
      )}
    </div>
  );
}
