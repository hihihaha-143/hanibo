import type { Phrase } from "../../../api/course";
import PhraseToken from "./PhraseToken";
import SpeakControls from "../../../components/SpeakButton/SpeakControls";

interface PhraseBlockProps {
  phrase: Phrase;
}

export default function PhraseBlock({ phrase }: PhraseBlockProps) {
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
        <SpeakControls text={phrase.hangul} className="phrase-block__speak" />
      </div>

      <div className="phrase-block__translation">{phrase.translation}</div>
    </div>
  );
}
