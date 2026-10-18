interface LetterFamilyBlockProps {
  symbols: string[];
  note: string | null;
  currentSymbol: string;
}

export default function LetterFamilyBlock({
  symbols,
  note,
  currentSymbol,
}: LetterFamilyBlockProps) {
  if (!symbols.length) return null;

  return (
    <div className="letter-family-block">
      <span className="letter-family-block__label">Семейство букв</span>

      <div className="letter-family-block__row">
        {symbols.map((symbol) => (
          <div
            key={symbol}
            className={
              symbol === currentSymbol
                ? "letter-family-block__item letter-family-block__item--current"
                : "letter-family-block__item"
            }
          >
            <span className="letter-family-block__letter">{symbol}</span>
          </div>
        ))}
      </div>

      {note && <p className="letter-family-block__note">{note}</p>}
    </div>
  );
}
