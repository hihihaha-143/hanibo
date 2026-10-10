import { motion } from "framer-motion";
import type { GrammarRule } from "../../../../api/course";
import PhraseBlock from "../PhraseBlock";
import { spring } from "../../../../lib/motion";

interface GrammarRuleCardProps {
  rule: GrammarRule;
}

export default function GrammarRuleCard({ rule }: GrammarRuleCardProps) {
  return (
    <motion.div
      className="grammar-rule-card"
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={spring.base}
    >
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
    </motion.div>
  );
}
