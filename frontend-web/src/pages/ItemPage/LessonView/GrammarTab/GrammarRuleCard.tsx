import type { GrammarRule } from "../../../../api/course";
import PhraseBlock from "../PhraseBlock";

interface GrammarRuleCardProps {
  rule: GrammarRule;
}

export default function GrammarRuleCard({ rule }: GrammarRuleCardProps) {
  return (
    <div className="grammar-rule-card">
      <div className="grammar-rule-card__header">
        <h3 className="grammar-rule-card__title">{rule.title}</h3>
        {rule.form && (
          <span className="grammar-rule-card__form">{rule.form.title}</span>
        )}
      </div>

      <div className="grammar-rule-card__construction">{rule.construction}</div>

      {rule.phrases.length > 0 && (
        <div className="grammar-rule-card__phrases">
          {rule.phrases.map((phrase) => (
            <PhraseBlock key={phrase.id} phrase={phrase} />
          ))}
        </div>
      )}
    </div>
  );
}
