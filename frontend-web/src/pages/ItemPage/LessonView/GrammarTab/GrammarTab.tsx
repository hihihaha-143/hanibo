import type { GrammarRule } from "../../../../api/course";
import GrammarRuleCard from "./GrammarRuleCard";

interface GrammarTabProps {
  rules: GrammarRule[];
}

export default function GrammarTab({ rules }: GrammarTabProps) {
  return (
    <div className="grammar-tab">
      {rules.map((rule) => (
        <GrammarRuleCard key={rule.id} rule={rule} />
      ))}
    </div>
  );
}
