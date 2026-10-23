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
import { spring } from "../../../../lib/motion";

interface TestProps {
  questions: TestQuestion[];
  onFinish: (correct: number, total: number, passed: boolean) => void;
  onRepeat: () => void;
  onBack: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export default function Test({
  questions,
  onFinish,
  onRepeat,
  onBack,
  backLabel,
  onNext,
  nextLabel,
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

  if (total === 0) {
    return (
      <div className="test">
        <div className="test__empty">Вопросы для этого теста не найдены.</div>
        <div className="test__footer">
          <motion.button
            type="button"
            className="test__next"
            onClick={onBack}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            {backLabel ?? "Назад"}
          </motion.button>
        </div>
      </div>
    );
  }

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
  };

  const handleSelectBoolean = (value: boolean) => {
    if (answered) return;
    setSelectedValue(value);
    setAnswered(true);
    if (current.type === "true-false" && value === current.correct) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleSubmitText = (value: string) => {
    if (answered) return;
    if (current.type !== "text-input") return;
    const correct = checkTextAnswer(value, current.correctAnswer);
    setTextInputCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleMatchSubmit = (correct: boolean) => {
    if (answered) return;
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleFillBlankSelect = (index: number) => {
    if (answered) return;
    if (current.type !== "fill-blank") return;
    if (current.mode !== "choice") return;
    const correct = index === current.correctIndex;
    setSelectedIndex(index);
    setFillBlankCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleFillBlankSubmit = (value: string) => {
    if (answered) return;
    if (current.type !== "fill-blank") return;
    if (current.mode !== "input") return;
    const correct = checkTextAnswer(value, current.correctAnswer);
    setFillBlankCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleWordOrderSubmit = (correct: boolean) => {
    if (answered) return;
    setWordOrderCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleSyllableGapSelect = (index: number) => {
    if (answered) return;
    if (current.type !== "syllable-gap") return;
    if (current.mode !== "choice") return;
    const correct = index === current.correctIndex;
    setSelectedIndex(index);
    setSyllableGapCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleSyllableGapSubmit = (value: string) => {
    if (answered) return;
    if (current.type !== "syllable-gap") return;
    if (current.mode !== "input") return;
    const correct = checkTextAnswer(value, current.correctAnswer);
    setSyllableGapCorrect(correct);
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleFlashcardAnswer = (_known: boolean) => {
    if (answered) return;
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      const percent =
        gradableTotal > 0 ? (correctCount / gradableTotal) * 100 : 0;
      const passed = percent > 70;
      setFinished(true);
      onFinish(correctCount, gradableTotal, passed);
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setSelectedIndex(null);
      setSelectedValue(null);
      setTextInputCorrect(null);
      setFillBlankCorrect(null);
      setWordOrderCorrect(null);
      setSyllableGapCorrect(null);
    }
  };

  const handleRepeatInternal = () => {
    setCurrentIndex(0);
    setAnswered(false);
    setSelectedIndex(null);
    setSelectedValue(null);
    setTextInputCorrect(null);
    setFillBlankCorrect(null);
    setWordOrderCorrect(null);
    setSyllableGapCorrect(null);
    setCorrectCount(0);
    setFinished(false);
    onRepeat();
  };

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

  useHotkeys(
    "1,2",
    (e) => {
      if (answered) return;
      if (current.type !== "true-false") return;
      handleSelectBoolean(e.key === "1");
    },
    [current, answered],
  );

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
    const passed = percent > 70;
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
      <div className="progress-bar">
        <motion.div
          className="progress-bar__fill"
          animate={{ width: `${progressPercent}%` }}
          transition={spring.bouncy}
        />
      </div>

      <div className="test__counter">
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
        <div className="test__footer">
          <motion.button
            type="button"
            className="btn btn--accent btn--lg test__next"
            onClick={handleNext}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            Далее
          </motion.button>
        </div>
      )}
    </div>
  );
}
