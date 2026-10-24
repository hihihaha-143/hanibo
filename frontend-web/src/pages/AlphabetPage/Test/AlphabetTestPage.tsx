import { Navigate, useNavigate, useParams } from "react-router-dom";
import type { AlphabetCategory } from "../../../api/alphabet";
import { useAlphabet } from "../useAlphabet";
import LetterGroupTestBlock from "./LetterGroupTestBlock";

const VALID_CATEGORIES: AlphabetCategory[] = [
  "vowel",
  "consonant",
  "diphthong",
  "assimilation",
];

function isCategory(value: string | undefined): value is AlphabetCategory {
  return !!value && (VALID_CATEGORIES as string[]).includes(value);
}

export default function AlphabetTestPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { letters, loading, error } = useAlphabet();

  if (!isCategory(category)) {
    return <Navigate to="/alphabet" replace />;
  }

  const handleBack = () => navigate("/alphabet");

  if (loading) {
    return (
      <div className="alphabet-test-page">
        <p className="alphabet-test-page__status">Загрузка…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alphabet-test-page">
        <p className="alphabet-test-page__status alphabet-test-page__status--error">
          {error}
        </p>
      </div>
    );
  }

  const groupLetters = letters.filter((l) => l.category === category);

  if (groupLetters.length === 0) {
    return (
      <div className="alphabet-test-page">
        <p className="alphabet-test-page__status">
          Для этой группы пока нет букв.
        </p>
      </div>
    );
  }

  return (
    <div className="alphabet-test-page">
      <LetterGroupTestBlock
        letters={groupLetters}
        category={category}
        onBack={handleBack}
      />
    </div>
  );
}
