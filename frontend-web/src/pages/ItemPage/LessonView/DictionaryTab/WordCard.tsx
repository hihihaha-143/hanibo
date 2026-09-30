import { Volume2 } from "lucide-react";
import type { CourseItemWord } from "../../../../api/course";
import PhraseBlock from "../PhraseBlock";

interface WordCardProps {
  word: CourseItemWord;
}

export default function WordCard({ word }: WordCardProps) {
  const phrase = word.phrases[0] ?? null;

  const speak = (text: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="word-card">
      <div className="word-card__main">
        <span className="word-card__hangul">{word.hangul}</span>
        <span className="word-card__translation">{word.translation}</span>

        <div className="word-card__speak">
          <button
            type="button"
            className="word-card__speak-button"
            onClick={() => speak(word.hangul, 0.5)}
            title="Медленно"
          >
            <Volume2 size={16} />
            <span>0.5</span>
          </button>
          <button
            type="button"
            className="word-card__speak-button"
            onClick={() => speak(word.hangul, 1)}
            title="Обычно"
          >
            <Volume2 size={16} />
            <span>1</span>
          </button>
        </div>
      </div>

      {phrase && <PhraseBlock phrase={phrase} />}
    </div>
  );
}
