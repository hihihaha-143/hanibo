import { useEffect, useRef, useState } from "react";
import { pdfjs } from "../../lib/pdf";

interface PdfThumbBlockProps {
  pdf: pdfjs.PDFDocumentProxy;
  pageNumber: number;
  onClick: () => void;
  isActive: boolean;
}

export default function PdfThumbBlock({
  pdf,
  pageNumber,
  onClick,
  isActive,
}: PdfThumbBlockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLButtonElement>(null);

  // Ленивая отрисовка, когда миниатюра попадает в область видимости
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || rendered) return;
    let cancelled = false;

    const run = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Фиксированная ширина миниатюры
        const viewport = page.getViewport({ scale: 1 });
        const scale = 120 / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        await page.render({
          canvasContext: ctx,
          viewport: scaledViewport,
        } as any).promise;
        if (!cancelled) setRendered(true);
      } catch (e) {
        // Игнорируем ошибки рендера миниатюр
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [visible, rendered, pdf, pageNumber]);

  return (
    <button
      ref={wrapperRef}
      type="button"
      onClick={onClick}
      className={
        "library-thumbs-block__item" +
        (isActive ? " library-thumbs-block__item--active" : "")
      }
    >
      <div className="library-thumbs-block__canvas-wrap">
        {!rendered && <div className="library-thumbs-block__placeholder" />}
        <canvas
          ref={canvasRef}
          style={{ display: rendered ? "block" : "none" }}
        />
      </div>
      <span className="library-thumbs-block__num">{pageNumber}</span>
    </button>
  );
}
