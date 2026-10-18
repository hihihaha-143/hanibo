import { useEffect, useState } from "react";
import { getAlphabet, type AlphabetLetter } from "../../api/alphabet";

interface AlphabetState {
  letters: AlphabetLetter[];
  loading: boolean;
  error: string | null;
}

export function useAlphabet(): AlphabetState {
  const [letters, setLetters] = useState<AlphabetLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAlphabet()
      .then((data) => {
        if (!cancelled) setLetters(data);
      })
      .catch(() => {
        if (!cancelled) setError("Не удалось загрузить алфавит");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { letters, loading, error };
}
