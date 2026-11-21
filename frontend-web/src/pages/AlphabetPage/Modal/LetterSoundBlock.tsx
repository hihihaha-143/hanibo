import SpeakControls from "../../../components/SpeakButton/SpeakControls";

interface LetterSoundBlockProps {
  ipa: string | null;
  note: string | null;
  sampleSyllable: string | null;
  sampleRomanization: string | null;
}

export default function LetterSoundBlock({
  ipa,
  note,
  sampleSyllable,
  sampleRomanization,
}: LetterSoundBlockProps) {
  if (!ipa && !note && !sampleSyllable) return null;

  return (
    <div className="letter-sound-block">
      <div className="letter-sound-block__header">
        <span className="letter-sound-block__title">Звук</span>
        {ipa && <span className="letter-sound-block__ipa">[{ipa}]</span>}
      </div>

      {note && <p className="letter-sound-block__note">{note}</p>}

      {sampleSyllable && (
        <div className="letter-sound-block__sample-row">
          <span className="letter-sound-block__sample-syllable">
            {sampleSyllable}
          </span>
          {sampleRomanization && (
            <span className="letter-sound-block__sample-romanization">
              {sampleRomanization}
            </span>
          )}

          <SpeakControls
            text={sampleSyllable}
            className="letter-sound-block__speak"
          />
        </div>
      )}
    </div>
  );
}
