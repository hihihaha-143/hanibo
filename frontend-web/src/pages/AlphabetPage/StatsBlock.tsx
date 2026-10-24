import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { spring } from "../../lib/motion";
import type { AlphabetLetter } from "../../api/alphabet";
import LetterGridBlock from "./Modal/LetterGridBlock";

interface StatsBlockProps {
  letters: AlphabetLetter[];
}

interface GroupStat {
  key: "vowels" | "consonants" | "diphthongs" | "assimilation";
  title: string;
  letters: AlphabetLetter[];
}

const GROUPS: Array<{
  key: GroupStat["key"];
  title: string;
  category: AlphabetLetter["category"];
}> = [
  { key: "vowels", title: "Гласные", category: "vowel" },
  { key: "consonants", title: "Согласные", category: "consonant" },
  { key: "diphthongs", title: "Дифтонги", category: "diphthong" },
  { key: "assimilation", title: "Ассимиляция", category: "assimilation" },
];

function countMastered(list: AlphabetLetter[]): number {
  return list.filter((l) => l.progress.score >= l.progress.max_score).length;
}

export default function StatsBlock({ letters }: StatsBlockProps) {
  const navigate = useNavigate();

  const groups: GroupStat[] = GROUPS.map((g) => ({
    key: g.key,
    title: g.title,
    letters: letters.filter((l) => l.category === g.category),
  }));

  const totalCount = letters.length;
  const totalMastered = countMastered(letters);
  const totalPercent =
    totalCount > 0 ? Math.round((totalMastered / totalCount) * 100) : 0;

  return (
    <div className="stats-block">
      <div className="stats-block__summary">
        <div className="stats-block__row">
          <span className="stats-block__label">
            Общий прогресс: {totalMastered} / {totalCount}
          </span>
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
        </div>

        {groups.map((g) => {
          const mastered = countMastered(g.letters);
          const total = g.letters.length;
          const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;

          return (
            <div className="stats-block__row" key={g.key}>
              <span className="stats-block__label">
                {g.title}: {mastered} / {total}
              </span>
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}

        <motion.button
          type="button"
          className="btn btn--accent stats-block__all-button"
          onClick={() => navigate("/alphabet/test/all")}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          Пройти всё
        </motion.button>
      </div>

      {groups.map((g) => (
        <div className="stats-block__group" key={g.key}>
          <h3 className="stats-block__group-title">{g.title}</h3>
          {g.letters.length > 0 ? (
            <LetterGridBlock letters={g.letters} showProgress />
          ) : (
            <p className="stats-block__empty">Пока нет записей.</p>
          )}
        </div>
      ))}
    </div>
  );
}
