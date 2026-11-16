import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ArrowLeft, Volume2 } from "lucide-react";
import {
  getPhraseAudioChoose,
  postReward,
  type AudioChooseWord,
} from "../../../api/minigames";
import { updateUserPhraseProgress } from "../../../api/dictionary";
import { useAuth } from "../../../context/useAuth";
import { useSpeech } from "../../../lib/useSpeech";

const TOTAL_QUESTIONS = 10;
const NEXT_DELAY = 1000;

type Phase = "playing" | "result" | "loading";

interface AnswerRecord {
  correct: boolean;
}

interface QuestionState {
  target: AudioChooseWord;
  variants: AudioChooseWord[];
  correctIndex: number;
}

interface PhraseAudioChooseGameProps {
  onClose: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function PhraseAudioChooseGame({ onClose }: PhraseAudioChooseGameProps) {
  const { refreshUser } = useAuth();
  const { speak } = useSpeech();

  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<QuestionState | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reward, setReward] = useState<number | null>(null);

  const loadQuestion = useCallback(() => {
    setSelected(null);
    setAnswered(false);

    getPhraseAudioChoose()
      .then((data) => {
        const all = shuffle([data.target, ...data.distractors]);
        const correctIndex = all.findIndex((p) => p.id === data.target.id);

        setQuestion({ target: data.target, variants: all, correctIndex });
        setPhase("playing");

        setTimeout(() => speak(data.target.hangul), 200);
      })
      .catch(() => {
        setQuestion(null);
        setPhase("result");
      });
  }, [speak]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  const finishGame = useCallback(
    async (allAnswers: AnswerRecord[]) => {
      setPhase("result");
      const correct = allAnswers.filter((a) => a.correct).length;

      try {
        const res = await postReward(correct, allAnswers.length);
        setReward(res.reward);
        await refreshUser();
      } catch {
        setReward(0);
      }
    },
    [refreshUser],
  );

  const handleSelect = useCallback(
    (i: number) => {
      if (!question || answered) return;

      setSelected(i);
      setAnswered(true);

      const isCorrect = i === question.correctIndex;
      const nextAnswers = [...answers, { correct: isCorrect }];
      setAnswers(nextAnswers);

      updateUserPhraseProgress(question.target.id, isCorrect).catch(() => {});

      setTimeout(() => {
        if (nextAnswers.length >= TOTAL_QUESTIONS) {
          finishGame(nextAnswers);
        } else {
          setIndex((idx) => idx + 1);
          loadQuestion();
        }
      }, NEXT_DELAY);
    },
    [question, answered, answers, finishGame, loadQuestion],
  );

  useHotkeys(
    ["1", "2", "3", "4"],
    (e) => {
      const idx = Number(e.key) - 1;
      if (idx < 4) handleSelect(idx);
    },
    {
      enabled: phase === "playing" && !answered,
      preventDefault: true,
    },
    [handleSelect, phase, answered],
  );

  const restart = useCallback(() => {
    setAnswers([]);
    setIndex(0);
    setReward(null);
    setPhase("loading");
    loadQuestion();
  }, [loadQuestion]);

  return (
    <div className="audio-choose-game">
      <header className="audio-choose-game__header">
        <button
          type="button"
          className="audio-choose-game__back"
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <h2 className="audio-choose-game__title">Аудио-угадайка</h2>
        {phase === "playing" && (
          <span className="audio-choose-game__progress">
            {index + 1} / {TOTAL_QUESTIONS}
          </span>
        )}
      </header>

      {phase === "loading" && (
        <p className="audio-choose-game__state">Загрузка…</p>
      )}

      {phase === "playing" && question && (
        <div className="audio-choose-game__body">
          <div className="audio-choose">
            <div className="audio-choose__player">
              <button
                type="button"
                className="audio-choose__play-button"
                onClick={() => speak(question.target.hangul)}
                aria-label="Прослушать"
              >
                <Volume2 size={32} />
              </button>
              <div className="audio-choose__speeds">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => speak(question.target.hangul, 0.5)}
                >
                  <Volume2 size={14} />
                  <span>0.5</span>
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => speak(question.target.hangul, 1)}
                >
                  <Volume2 size={14} />
                  <span>1</span>
                </button>
              </div>
            </div>
          </div>

          <div className="choose-question__variants audio-choose-game__variants">
            {question.variants.map((variant, i) => {
              const isCorrect = i === question.correctIndex;
              let modifier = "";
              if (answered) {
                if (isCorrect) modifier = "choose-question__variant--correct";
                else if (i === selected)
                  modifier = "choose-question__variant--wrong";
              }

              return (
                <button
                  key={variant.id}
                  type="button"
                  className={`choose-question__variant ${modifier}`}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                >
                  <span className="choose-question__variant-key">{i + 1}</span>
                  <span className="choose-question__variant-text">
                    {variant.translation}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="audio-choose-game__result">
          <p className="audio-choose-game__result-score">
            {answers.filter((a) => a.correct).length} / {answers.length}
          </p>
          <p className="audio-choose-game__result-percent">
            {answers.length > 0
              ? Math.round(
                  (answers.filter((a) => a.correct).length / answers.length) *
                    100,
                )
              : 0}
            %
          </p>
          {reward !== null && (
            <p className="audio-choose-game__result-reward">
              {reward > 0 ? `+${reward} черники` : "Без награды"}
            </p>
          )}

          <div className="audio-choose-game__result-actions">
            <button type="button" className="btn btn--accent" onClick={restart}>
              Ещё раз
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
