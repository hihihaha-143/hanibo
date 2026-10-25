import { useEffect, useRef, useState } from "react";
import HangulWriter from "hangul-writer";
import { Play, RotateCcw } from "lucide-react";

interface LetterWritingBlockProps {
  symbol: string;
}

const WRITER_SIZE = 280;

export default function LetterWritingBlock({
  symbol,
}: LetterWritingBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<ReturnType<typeof HangulWriter.create> | null>(null);
  const [showOutline, setShowOutline] = useState(true);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [quizKey, setQuizKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";
    let feedbackTimer: ReturnType<typeof setTimeout>;

    const showFeedback = (type: "correct" | "wrong") => {
      setFeedback(type);
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => setFeedback(null), 1200);
    };

    const accentColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim() || "#3B82F6";

    const writer = HangulWriter.create(containerRef.current, symbol, {
      width: WRITER_SIZE,
      height: WRITER_SIZE,
      padding: 12,
      showOutline,
      showHintAfterMisses: 2,
      drawingWidth: 28,
      drawingColor: accentColor,
      leniency: 1.4,
    });

    writerRef.current = writer;
    setFeedback(null);

    writer.quiz({
      onCorrectStroke: () => showFeedback("correct"),
      onMistake: () => showFeedback("wrong"),
      onComplete: () => {
        // Опционально: показать финальный фидбек можно тут же
      },
    });

    return () => {
      clearTimeout(feedbackTimer);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      writerRef.current = null;
    };
  }, [symbol, showOutline, quizKey]);

  const handleAnimate = () => {
    writerRef.current?.animateCharacter();
  };

  const handleReset = () => {
    setQuizKey((k) => k + 1);
  };

  return (
    <div className="letter-writing-block">
      <div className="letter-writing-block__toolbar">
        <button
          type="button"
          className="letter-writing-block__action"
          onClick={handleAnimate}
          title="Показать порядок штрихов"
        >
          <Play size={16} />
          <span>Показать</span>
        </button>

        <button
          type="button"
          className="letter-writing-block__action"
          onClick={handleReset}
          title="Начать заново"
        >
          <RotateCcw size={16} />
          <span>Сбросить</span>
        </button>

        <label className="letter-writing-block__toggle">
          <input
            type="checkbox"
            checked={showOutline}
            onChange={(e) => setShowOutline(e.target.checked)}
          />
          <span>Показывать контур</span>
        </label>
      </div>

      <div className="letter-writing-block__canvas-wrap">
        <div ref={containerRef} className="letter-writing-block__canvas" />
        {feedback && (
          <div
            className={`letter-writing-block__feedback letter-writing-block__feedback--${feedback}`}
          >
            {feedback === "correct" ? "Да" : "Нет"}
          </div>
        )}
      </div>
    </div>
  );
}
