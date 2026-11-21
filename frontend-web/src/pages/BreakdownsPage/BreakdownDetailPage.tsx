import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Eye,
  EyeOff,
  Play,
} from "lucide-react";
import BackLink from "../../components/BackLink/BackLink";
import SpeakControls from "../../components/SpeakButton/SpeakControls";
import StateBlock from "../../components/StateBlock/StateBlock";
import { useAuth } from "../../context/useAuth";
import {
  findBreakdown,
  type BreakdownEpisode,
  type BreakdownItem,
  type BreakdownLine,
  type BreakdownPage,
} from "./breakdownData";
import {
  getItemProgress,
  isPhraseSaved,
  saveItemProgress,
  toggleSavedPhrase,
  type BreakdownItemProgress,
} from "./breakdownStorage";

function ownerFor(userId: number | undefined): string {
  return userId ? String(userId) : "guest";
}

function parseTime(value?: string): number {
  if (!value) return 0;
  const [minutes, seconds] = value.split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}

interface LinePanelProps {
  item: BreakdownItem;
  line: BreakdownLine;
  owner: string;
  saved: boolean;
  onToggleSaved: () => void;
}

function LinePanel({ item, line, owner, saved, onToggleSaved }: LinePanelProps) {
  return (
    <div className="breakdown-side">
      <div className="breakdown-side__eyebrow">
        <Clapperboard size={14} aria-hidden="true" />
        Разбор реплики
      </div>

      <div className="breakdown-side__line">
        <p className="breakdown-side__hangul">{line.hangul}</p>
        <SpeakControls text={line.hangul} />
      </div>

      <div className="breakdown-side__translation">
        <span>Перевод</span>
        <p>{line.translation}</p>
      </div>

      <div className="breakdown-side__words">
        <span className="breakdown-side__section-title">Слова и формы</span>
        <ul>
          {line.words.map((word) => (
            <li key={`${line.id}-${word.hangul}`} className="breakdown-word">
              <span className="breakdown-word__hangul">{word.hangul}</span>
              <span className="breakdown-word__translation">
                {word.translation}
              </span>
              {word.grammar && (
                <span className="breakdown-word__grammar">{word.grammar}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {line.note && (
        <div className="breakdown-side__note">
          <span className="breakdown-side__section-title">Грамматика</span>
          <p>{line.note}</p>
        </div>
      )}

      <button
        type="button"
        className={
          "btn btn--sm btn--block " +
          (saved ? "btn--success" : "btn--outline")
        }
        onClick={onToggleSaved}
        aria-pressed={saved}
        title={saved ? "Убрать из сохранённых" : "Сохранить фразу"}
      >
        <Bookmark size={15} />
        {saved ? "Фраза сохранена" : "Сохранить фразу"}
      </button>

      <span className="breakdown-side__source">{item.title}</span>
      <span className="breakdown-side__owner-note">
        {owner === "guest"
          ? "Войди, чтобы прогресс сохранился в аккаунте"
          : "Прогресс сохраняется в аккаунте"}
      </span>
    </div>
  );
}

function MangaPanel({
  page,
  translationVisible,
  selectedLineId,
  onSelect,
  onPrev,
  onNext,
  pageIndex,
  totalPages,
}: {
  page: BreakdownPage;
  translationVisible: boolean;
  selectedLineId: string | null;
  onSelect: (line: BreakdownLine) => void;
  onPrev: () => void;
  onNext: () => void;
  pageIndex: number;
  totalPages: number;
}) {
  return (
    <section className="breakdown-reader">
      <div className="breakdown-panel" style={{ background: page.background }}>
        <span className="breakdown-panel__decor breakdown-panel__decor--one" aria-hidden="true" />
        <span className="breakdown-panel__decor breakdown-panel__decor--two" aria-hidden="true" />
        <span className="breakdown-panel__art" aria-hidden="true">장면</span>
        <div className="breakdown-panel__top">
          <span>{page.title}</span>
          <span>
            {pageIndex + 1} / {totalPages}
          </span>
        </div>

        <div className="breakdown-panel__lines">
          {page.lines.map((line) => (
            <button
              key={line.id}
              type="button"
              className={
                "breakdown-panel__line" +
                (line.id === selectedLineId
                  ? " breakdown-panel__line--selected"
                  : "")
              }
              onClick={() => onSelect(line)}
              aria-pressed={line.id === selectedLineId}
            >
              <span className="breakdown-panel__speech">{line.hangul}</span>
              {translationVisible && (
                <span className="breakdown-panel__translation">
                  {line.translation}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="breakdown-reader__nav">
        <button
          type="button"
          className="btn btn--icon"
          onClick={onPrev}
          disabled={pageIndex === 0}
          aria-label="Предыдущий кадр"
        >
          <ChevronLeft size={18} />
        </button>
        <span>
          Кадр {pageIndex + 1} из {totalPages}
        </span>
        <button
          type="button"
          className="btn btn--icon"
          onClick={onNext}
          disabled={pageIndex >= totalPages - 1}
          aria-label="Следующий кадр"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

function DramaPanel({
  item,
  episode,
  episodes,
  episodeIndex,
  onEpisodeChange,
  selectedLineId,
  onSelect,
  translationVisible,
}: {
  item: BreakdownItem;
  episode: BreakdownEpisode;
  episodes: BreakdownEpisode[];
  episodeIndex: number;
  onEpisodeChange: (index: number) => void;
  selectedLineId: string | null;
  onSelect: (line: BreakdownLine) => void;
  translationVisible: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  const seek = (line: BreakdownLine) => {
    onSelect(line);
    if (videoRef.current && line.time) {
      videoRef.current.currentTime = parseTime(line.time);
    }
  };

  return (
    <section className="breakdown-reader">
      <div className="breakdown-video">
        {episode.videoUrl && !videoError ? (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
          >
            <source src={episode.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="breakdown-video__fallback">
            <Play size={34} aria-hidden="true" />
            <strong>Видео-разбор</strong>
            <span>Видео для этой серии пока не загружено.</span>
          </div>
        )}

        <div className="breakdown-video__overlay">
          <span className="breakdown-video__badge">
            <Clapperboard size={13} /> Дорама · демо-видео
          </span>
          <span>{item.title}</span>
        </div>
      </div>

      <div className="breakdown-transcript">
        <div className="breakdown-transcript__head">
          <div>
            <span>{episode.title}</span>
            <small>{episode.duration}</small>
          </div>
          <select
            className="select breakdown-transcript__episode"
            value={episodeIndex}
            onChange={(event) => onEpisodeChange(Number(event.target.value))}
            aria-label="Выбрать серию"
          >
            {episodes.map((entry, index) => (
              <option key={entry.id} value={index}>
                {entry.title}
              </option>
            ))}
          </select>
        </div>

        <div className="breakdown-transcript__lines">
          {episode.lines.map((line) => (
            <button
              key={line.id}
              type="button"
              className={
                "breakdown-transcript__line" +
                (selectedLineId === line.id
                  ? " breakdown-transcript__line--active"
                  : "")
              }
              onClick={() => seek(line)}
              aria-pressed={selectedLineId === line.id}
            >
              <span className="breakdown-transcript__time">{line.time}</span>
              <span className="breakdown-transcript__text">
                <strong>{line.hangul}</strong>
                {translationVisible && <span>{line.translation}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BreakdownDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const item = findBreakdown(id);
  const owner = ownerFor(user?.id);

  const [progress, setProgress] = useState<BreakdownItemProgress>(() =>
    getItemProgress(owner, id ?? ""),
  );
  const [translationVisible, setTranslationVisible] = useState(false);
  const [selectedLine, setSelectedLine] = useState<BreakdownLine | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    const next = getItemProgress(owner, id);
    setProgress(next);
    const source =
      item?.kind === "manga"
        ? item.pages?.[next.page]?.lines[0]
        : item?.episodes?.[next.episode]?.lines[0];
    setSelectedLine(source ?? null);
    setSaved(source ? isPhraseSaved(owner, id, source.id) : false);
  }, [id, item, owner]);

  if (!item) {
    return (
      <div className="page breakdown-detail-page">
        <StateBlock variant="empty" text="Такого разбора нет." />
        <BackLink to="/breakdowns">К разборам</BackLink>
      </div>
    );
  }

  const isManga = item.kind === "manga";
  const pages = item.pages ?? [];
  const episodes = item.episodes ?? [];
  const pageIndex = Math.min(progress.page, Math.max(0, pages.length - 1));
  const episodeIndex = Math.min(
    progress.episode,
    Math.max(0, episodes.length - 1),
  );

  const currentPage = pages[pageIndex];
  const currentEpisode = episodes[episodeIndex];

  const updateProgress = (patch: Partial<BreakdownItemProgress>) => {
    const next = { ...progress, ...patch };
    setProgress(next);
    saveItemProgress(owner, item.id, patch);
  };

  const selectLine = (line: BreakdownLine) => {
    setSelectedLine(line);
    setSaved(isPhraseSaved(owner, item.id, line.id));
  };

  const changePage = (next: number) => {
    const page = pages[next];
    if (!page) return;
    updateProgress({ page: next });
    selectLine(page.lines[0]);
  };

  const changeEpisode = (next: number) => {
    const episode = episodes[next];
    if (!episode) return;
    updateProgress({ episode: next });
    selectLine(episode.lines[0]);
  };

  const toggleSaved = () => {
    if (!selectedLine) return;
    const next = toggleSavedPhrase(owner, {
      itemId: item.id,
      itemTitle: item.title,
      lineId: selectedLine.id,
      hangul: selectedLine.hangul,
      translation: selectedLine.translation,
    });
    setSaved(next);
  };

  return (
    <div className="page breakdown-detail-page">
      <BackLink to="/breakdowns">Все разборы</BackLink>

      <header className="breakdown-detail__hero">
        <div
          className="breakdown-detail__cover"
          style={{
            background: `linear-gradient(140deg, ${item.cover.from}, ${item.cover.to})`,
            color: item.cover.ink,
          }}
        >
          <span>{item.originalTitle}</span>
          <small>{item.title}</small>
        </div>
        <div className="breakdown-detail__info">
          <div className="breakdown-detail__badges">
            <span className="breakdown-detail__badge">
              {isManga ? "Манхва" : "Дорама"}
            </span>
            <span className="breakdown-detail__badge">{item.level}</span>
          </div>
          <h1>{item.title}</h1>
          <p className="breakdown-detail__original">{item.originalTitle}</p>
          <p className="breakdown-detail__description">{item.description}</p>
          <div className="breakdown-detail__meta">
            <span>{item.latest}</span>
            <span>{item.genres.join(" · ")}</span>
            <span>{item.updatedAt}</span>
          </div>
        </div>
      </header>

      <div className="breakdown-toolbar">
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => setTranslationVisible((value) => !value)}
          aria-pressed={translationVisible}
        >
          {translationVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          {translationVisible ? "Скрыть перевод" : "Показать перевод"}
        </button>

        <button
          type="button"
          className={
            "btn btn--sm " +
            (progress.completed ? "btn--success" : "btn--accent")
          }
          onClick={() =>
            updateProgress({ completed: !progress.completed })
          }
        >
          <Check size={16} />
          {progress.completed ? "Разобрано" : "Отметить разобранным"}
        </button>

        <Link to="/breakdowns?tab=account" className="breakdown-toolbar__account">
          В аккаунт
        </Link>
      </div>

      <div className="breakdown-workspace">
        {isManga && currentPage ? (
          <MangaPanel
            page={currentPage}
            translationVisible={translationVisible}
            selectedLineId={selectedLine?.id ?? null}
            onSelect={selectLine}
            onPrev={() => changePage(pageIndex - 1)}
            onNext={() => changePage(pageIndex + 1)}
            pageIndex={pageIndex}
            totalPages={pages.length}
          />
        ) : currentEpisode ? (
          <DramaPanel
            item={item}
            episode={currentEpisode}
            episodes={episodes}
            episodeIndex={episodeIndex}
            onEpisodeChange={changeEpisode}
            selectedLineId={selectedLine?.id ?? null}
            onSelect={selectLine}
            translationVisible={translationVisible}
          />
        ) : null}

        {selectedLine ? (
          <LinePanel
            item={item}
            line={selectedLine}
            owner={owner}
            saved={saved}
            onToggleSaved={toggleSaved}
          />
        ) : (
          <StateBlock variant="empty" text="Выбери реплику, чтобы увидеть разбор." />
        )}
      </div>
    </div>
  );
}
