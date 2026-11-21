import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Languages, SpellCheck } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import {
  getDictionary,
  getPhrases,
  type DictionaryPhrase,
  type DictionaryWord,
} from "../../api/dictionary";
import { getGrammarRules, type GrammarRule } from "../../api/grammar";
import SpeakControls from "../../components/SpeakButton/SpeakControls";
import StateBlock from "../../components/StateBlock/StateBlock";

const PREVIEW_LIMIT = 6;

interface MyDictionaryData {
  words: DictionaryWord[];
  phrases: DictionaryPhrase[];
  grammar: GrammarRule[];
}

function progressLabel(
  progress:
    | { is_learned?: boolean; mistakes_count?: number; interval_days?: number }
    | null
    | undefined,
): string {
  if (!progress) return "Не изучено";
  if (progress.is_learned) return "Изучено";
  if ((progress.mistakes_count ?? 0) > 0) {
    return `В процессе · ошибок: ${progress.mistakes_count}`;
  }
  return "В процессе";
}

type ProgressLike =
  | {
      is_learned?: boolean;
      mistakes_count?: number;
      interval_days?: number;
    }
  | null
  | undefined;

function DictionaryRow({
  title,
  translation,
  progress,
  to,
}: {
  title: string;
  translation: string;
  progress: ProgressLike;
  to: string;
}) {
  return (
    <div className="my-dictionary__row">
      <Link to={to} className="my-dictionary__main">
        <span className="my-dictionary__title">{title}</span>
        <span className="my-dictionary__translation">{translation}</span>
      </Link>
      <span className="my-dictionary__meta">{progressLabel(progress)}</span>
      <SpeakControls text={title} className="my-dictionary__speak" />
    </div>
  );
}

export default function MyDictionaryBlock() {
  const { user } = useAuth();
  const [data, setData] = useState<MyDictionaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      getDictionary({ tab: "progress", per_page: 200 }),
      getPhrases({ tab: "progress", per_page: 200 }),
      getGrammarRules({ tab: "progress", per_page: 200 }),
    ])
      .then(([words, phrases, grammar]) =>
        setData({
          words: words.data,
          phrases: phrases.data,
          grammar: grammar.data,
        }),
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) load();
    else setLoading(false);
  }, [user]);

  if (!user) {
    return (
      <div className="course-tab-empty">
        <Languages size={28} aria-hidden="true" />
        <p>Войдите, чтобы видеть слова, фразы и грамматику, которые изучаете.</p>
        <Link to="/login" className="btn btn--accent">
          Войти
        </Link>
      </div>
    );
  }

  if (loading) return <StateBlock variant="loading" />;
  if (error || !data) {
    return <StateBlock variant="error" onRetry={load} />;
  }

  const sections = [
    {
      id: "words",
      title: "Слова",
      icon: <BookOpen size={18} />,
      count: data.words.length,
      link: "/practice?tab=vocabulary",
      items: data.words.slice(0, PREVIEW_LIMIT).map((word) => ({
        id: `word-${word.id}`,
        title: word.hangul,
        translation: word.translation,
        progress: word.progress,
        to: "/practice?tab=vocabulary",
      })),
    },
    {
      id: "phrases",
      title: "Фразы",
      icon: <Languages size={18} />,
      count: data.phrases.length,
      link: "/practice?tab=phrases",
      items: data.phrases.slice(0, PREVIEW_LIMIT).map((phrase) => ({
        id: `phrase-${phrase.id}`,
        title: phrase.hangul,
        translation: phrase.translation,
        progress: phrase.progress,
        to: "/practice?tab=phrases",
      })),
    },
    {
      id: "grammar",
      title: "Грамматика",
      icon: <SpellCheck size={18} />,
      count: data.grammar.length,
      link: "/practice?tab=grammar",
      items: data.grammar.slice(0, PREVIEW_LIMIT).map((rule) => ({
        id: `grammar-${rule.id}`,
        title: rule.title,
        translation: rule.construction,
        progress: {
          is_learned: rule.status === "learned",
          mistakes_count: rule.mistakes_count ?? 0,
        },
        to: "/practice?tab=grammar",
      })),
    },
  ];

  return (
    <div className="my-dictionary">
      <p className="my-dictionary__intro">
        Всё, что сейчас в работе: слова, фразы и грамматика с SRS-прогрессом.
      </p>

      <div className="my-dictionary__grid">
        {sections.map((section) => (
          <section key={section.id} className="card my-dictionary__section">
            <header className="my-dictionary__head">
              <span className="my-dictionary__head-title">
                {section.icon}
                {section.title}
                <span className="my-dictionary__count">{section.count}</span>
              </span>
              <Link to={section.link} className="my-dictionary__all">
                Открыть
              </Link>
            </header>

            {section.items.length === 0 ? (
              <p className="my-dictionary__empty">Пока ничего не изучается.</p>
            ) : (
              <div className="my-dictionary__list">
                {section.items.map((item) => (
                  <DictionaryRow
                    key={item.id}
                    title={item.title}
                    translation={item.translation}
                    progress={item.progress}
                    to={item.to}
                  />
                ))}
              </div>
            )}

            {section.count > PREVIEW_LIMIT && (
              <Link to={section.link} className="my-dictionary__more">
                Ещё {section.count - PREVIEW_LIMIT}
              </Link>
            )}
          </section>
        ))}
      </div>

      <div className="my-dictionary__note">
        <GraduationCap size={18} aria-hidden="true" />
        <span>
          Статус «Изучено» появляется после финального шага SRS. Ошибки
          используются в разделе «Работа над ошибками».
        </span>
      </div>
    </div>
  );
}
