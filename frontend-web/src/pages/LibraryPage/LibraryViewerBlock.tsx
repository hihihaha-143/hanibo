import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import type { LibraryItem } from "../../types/library";
import { pdfjs } from "../../lib/pdf";
import PdfPageBlock from "./PdfPageBlock";
import StateBlock from "../../components/StateBlock/StateBlock";

interface LibraryViewerBlockProps {
  item: LibraryItem;
}

type FitMode = "width" | "page";

const STORAGE_PREFIX = "hanibo:library:lastPage:";
const STORAGE_PAGES_PER_VIEW = "hanibo:library:pagesPerView";
const STORAGE_FIT_MODE = "hanibo:library:fitMode";

export default function LibraryViewerBlock({ item }: LibraryViewerBlockProps) {
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1.414);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesPerView, setPagesPerView] = useState<1 | 2>(() => {
    const saved = localStorage.getItem(STORAGE_PAGES_PER_VIEW);
    return saved === "2" ? 2 : 1;
  });
  const [fitMode, setFitMode] = useState<FitMode>(() => {
    const saved = localStorage.getItem(STORAGE_FIT_MODE);
    return saved === "page" ? "page" : "width";
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewerHeight, setViewerHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [observerEnabled, setObserverEnabled] = useState(false);

  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const restoredRef = useRef(false);

  const storageKey = useMemo(
    () => (item.file_url ? STORAGE_PREFIX + item.file_url : ""),
    [item.file_url],
  );

  // Загрузка PDF
  useEffect(() => {
    if (!item.file_url) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    restoredRef.current = false;
    setObserverEnabled(false);

    const task = pdfjs.getDocument({
      url: item.file_url,
      wasmUrl: "/pdfjs/wasm/",
    });

    task.promise
      .then(async (doc) => {
        if (cancelled) {
          doc.destroy();
          return;
        }
        setPdf(doc);
        setNumPages(doc.numPages);
        try {
          const first = await doc.getPage(1);
          if (cancelled) return;
          const vp = first.getViewport({ scale: 1 });
          setAspectRatio(vp.height / vp.width);
        } catch {
          /* дефолт */
        }
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        console.error("Не удалось загрузить PDF:", e);
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      task.destroy();
    };
  }, [item.file_url]);

  // Ширина контейнера
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Высота скролл-области
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setViewerHeight(entry.contentRect.height);
    });
    ro.observe(el);
    setViewerHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const groups = useMemo(() => {
    const result: number[][] = [];
    for (let i = 1; i <= numPages; i += pagesPerView) {
      const group: number[] = [];
      for (let j = 0; j < pagesPerView && i + j <= numPages; j++) {
        group.push(i + j);
      }
      result.push(group);
    }
    return result;
  }, [numPages, pagesPerView]);

  const scrollToPage = useCallback((page: number, smooth: boolean = true) => {
    const el = pageRefs.current.get(page);
    if (el) {
      el.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
      });
    }
  }, []);

  const goPrev = () => {
    const next = Math.max(1, currentPage - pagesPerView);
    setCurrentPage(next);
    scrollToPage(next);
  };

  const goNext = () => {
    const next = Math.min(numPages, currentPage + pagesPerView);
    setCurrentPage(next);
    scrollToPage(next);
  };

  // Восстановление последней страницы
  useEffect(() => {
    if (!pdf || numPages === 0 || !storageKey) return;
    if (restoredRef.current) return;
    restoredRef.current = true;

    const saved = Number(localStorage.getItem(storageKey) || "0");
    const target = saved >= 1 && saved <= numPages ? saved : 1;

    setCurrentPage(target);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToPage(target, false);
        setObserverEnabled(true);
      });
    });
  }, [pdf, numPages, storageKey, scrollToPage]);

  // Сохранение текущей страницы
  useEffect(() => {
    if (!storageKey || !restoredRef.current) return;
    try {
      localStorage.setItem(storageKey, String(currentPage));
    } catch {
      /* noop */
    }
  }, [currentPage, storageKey]);

  // Сохранение режима "1/2 страницы"
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PAGES_PER_VIEW, String(pagesPerView));
    } catch {
      /* noop */
    }
  }, [pagesPerView]);

  // Сохранение режима "по ширине / по экрану"
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FIT_MODE, fitMode);
    } catch {
      /* noop */
    }
  }, [fitMode]);

  // IntersectionObserver (только после восстановления)
  useEffect(() => {
    if (!observerEnabled) return;
    const container = scrollRef.current;
    if (!container || groups.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = Number(entry.target.getAttribute("data-page"));
            if (pageNum) setCurrentPage(pageNum);
          }
        });
      },
      { root: container, threshold: 0.5 },
    );

    pageRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groups, observerEnabled]);

  // Клавиатура: ←/→, PageUp/PageDown, Home/End
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      switch (e.key) {
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          goPrev();
          break;
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          goNext();
          break;
        case "Home":
          e.preventDefault();
          setCurrentPage(1);
          scrollToPage(1);
          break;
        case "End":
          e.preventDefault();
          if (numPages > 0) {
            setCurrentPage(numPages);
            scrollToPage(numPages);
          }
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentPage, numPages, pagesPerView, scrollToPage]);

  if (!item.file_url) {
    return <StateBlock variant="empty" />;
  }

  const pageWidth = (() => {
    const singleMax = Math.min(900, containerWidth || 900);
    const doubleMax = Math.max(200, Math.floor((containerWidth - 32) / 2));
    const widthMax = pagesPerView === 2 ? doubleMax : singleMax;

    if (fitMode === "page" && viewerHeight > 0 && aspectRatio > 0) {
      const fromHeight = Math.floor((viewerHeight - 32) / aspectRatio);
      return Math.max(120, Math.min(widthMax, fromHeight));
    }
    return widthMax;
  })();

  return (
    <div className="library-viewer-block" ref={containerRef}>
      <div className="library-viewer-block__controls">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentPage <= 1}
          className="library-viewer-block__btn"
          title="Назад (←)"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="library-viewer-block__page-info">
          {currentPage} / {numPages || "—"}
        </span>

        <button
          type="button"
          onClick={goNext}
          disabled={numPages === 0 || currentPage >= numPages}
          className="library-viewer-block__btn"
          title="Вперёд (→)"
        >
          <ChevronRight size={18} />
        </button>

        <div className="library-viewer-block__spacer" />

        <button
          type="button"
          onClick={() => setPagesPerView(1)}
          className={
            "library-viewer-block__btn" +
            (pagesPerView === 1 ? " library-viewer-block__btn--active" : "")
          }
          title="Одна страница"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => setPagesPerView(2)}
          className={
            "library-viewer-block__btn" +
            (pagesPerView === 2 ? " library-viewer-block__btn--active" : "")
          }
          title="Две страницы"
        >
          2
        </button>

        <button
          type="button"
          onClick={() => setFitMode((m) => (m === "width" ? "page" : "width"))}
          className={
            "library-viewer-block__btn" +
            (fitMode === "page" ? " library-viewer-block__btn--active" : "")
          }
          title={fitMode === "page" ? "По ширине" : "По экрану"}
        >
          {fitMode === "page" ? (
            <Minimize2 size={16} />
          ) : (
            <Maximize2 size={16} />
          )}
        </button>
      </div>

      <div className="library-viewer-block__scroll" ref={scrollRef}>
        {loading && <StateBlock variant="loading" />}
        {error && <StateBlock variant="error" />}

        {!loading && !error && pdf && (
          <>
            {groups.map((group, gi) => (
              <div
                key={gi}
                className={
                  "library-viewer-block__group" +
                  (pagesPerView === 2
                    ? " library-viewer-block__group--double"
                    : "")
                }
              >
                {group.map((pageNum) => (
                  <div
                    key={pageNum}
                    data-page={pageNum}
                    ref={(el) => {
                      if (el) pageRefs.current.set(pageNum, el);
                      else pageRefs.current.delete(pageNum);
                    }}
                    className="library-viewer-block__page"
                  >
                    <PdfPageBlock
                      pdf={pdf}
                      pageNumber={pageNum}
                      width={pageWidth}
                      aspectRatio={aspectRatio}
                    />
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
