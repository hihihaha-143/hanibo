import type { AlphabetConfusion } from "../../api/alphabet";

interface LetterConfusionBlockProps {
  items: AlphabetConfusion[];
}

export default function LetterConfusionBlock({
  items,
}: LetterConfusionBlockProps) {
  if (!items.length) return null;

  return (
    <div className="letter-confusion-block">
      <span className="letter-confusion-block__label">Не путай с</span>

      <ul className="letter-confusion-block__list">
        {items.map((item) => (
          <li className="letter-confusion-block__item" key={item.symbol}>
            <span className="letter-confusion-block__letter">
              {item.symbol}
            </span>
            <span className="letter-confusion-block__hint">{item.hint}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
