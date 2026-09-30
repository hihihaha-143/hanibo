import { Volume2 } from "lucide-react";
import type { Phrase } from "../../../api/course";
import PhraseToken from "./PhraseToken";

interface PhraseBlockProps {
  phrase: Phrase;
}

export default function PhraseBlock({ phrase }: PhraseBlockProps) {
  const speak = (text: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const renderTokens = () => {
    if (phrase.tokens.length === 0) {
      return <span className="phrase-block__plain">{phrase.hangul}</span>;
    }

    return phrase.tokens.map((token, index) => (
      <span key={index}>
        <PhraseToken token={token} />
        {token.space_after && "\u00A0\u00A0"}
      </span>
    ));
  };

  return (
    <div className="phrase-block">
      <div className="phrase-block__hangul">
        <span className="phrase-block__tokens">{renderTokens()}</span>
        <div className="phrase-block__speak">
          <button
            type="button"
            className="phrase-block__speak-button"
            onClick={() => speak(phrase.hangul, 0.5)}
            title="Медленно"
          >
            <Volume2 size={16} />
            <span>0.5</span>
          </button>
          <button
            type="button"
            className="phrase-block__speak-button"
            onClick={() => speak(phrase.hangul, 1)}
            title="Обычно"
          >
            <Volume2 size={16} />
            <span>1</span>
          </button>
        </div>
      </div>

      <div className="phrase-block__translation">{phrase.translation}</div>
    </div>
  );
}
