import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { GrammarRule, PhraseGrammarRule } from "../../../../api/course";
import {
  generateGrammarTest,
  type TestQuestion,
} from "../../../../utils/testGenerator";
import { setGrammarPercent } from "../../../../utils/progress";
import GrammarRuleCard from "./GrammarRuleCard";
import Test from "../Test/Test";

interface GrammarTabProps {
  itemId: number;
  rules: GrammarRule[];
  pool: PhraseGrammarRule[];
  onGoToFinalTest: () => void;
  onProgressChange: () => void;
}

type Mode = "cards" | "test";

export default function GrammarTab({
  itemId,
  rules,
  pool,
  onGoToFinalTest,
  onProgressChange,
}: GrammarTabProps) {
  const [mode, setMode] = useState<Mode>("cards");
  const [questions, setQuestions] = useState<TestQuestion[]>([]);

  const buildPoolRules = (): GrammarRule[] =>
    pool.map((p) => ({
      id: p.id,
      title: p.title,
      construction: p.construction,
      form: null,
      level: null,
      phrases: [],
    }));

  const startTest = () => {
    setQuestions(generateGrammarTest(rules, [...rules, ...buildPoolRules()]));
    setMode("test");
  };

  const handleRepeat = () => {
    setQuestions(generateGrammarTest(rules, [...rules, ...buildPoolRules()]));
  };

  const handleBack = () => {
    setMode("cards");
  };

  const handleFinish = (correct: number, total: number, _isPassed: boolean) => {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    setGrammarPercent(itemId, percent);
    onProgressChange();
  };

  if (mode === "test") {
    return (
      <div className="grammar-tab">
        <Test
          questions={questions}
          onFinish={handleFinish}
          onRepeat={handleRepeat}
          onBack={handleBack}
          backLabel="К грамматике"
          onNext={onGoToFinalTest}
          nextLabel="К итоговому тесту"
        />
      </div>
    );
  }

  return (
    <div className="grammar-tab">
      {rules.map((rule) => (
        <GrammarRuleCard key={rule.id} rule={rule} />
      ))}

      <div className="grammar-tab__footer">
        <button
          type="button"
          className="grammar-tab__test-button"
          onClick={startTest}
        >
          <span>Пройти тест</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
