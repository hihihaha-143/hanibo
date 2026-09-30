import type { PhraseToken as PhraseTokenType } from "../../../api/course";

interface PhraseTokenProps {
  token: PhraseTokenType;
}

export default function PhraseToken({ token }: PhraseTokenProps) {
  const word = token.word;
  const rule = token.grammar_rule;

  if (!word && !rule) {
    return <span className="phrase-token">{token.text}</span>;
  }

  return (
    <span className="phrase-token">
      <span className="phrase-token__text">{token.text}</span>

      <span className="phrase-token__tooltip">
        {word && (
          <span className="phrase-token__tooltip-line">
            <strong>{word.hangul}</strong> — {word.translation}
          </span>
        )}
        {rule && (
          <span className="phrase-token__tooltip-line">
            <strong>{rule.title}</strong> — {rule.construction}
          </span>
        )}
      </span>
    </span>
  );
}
