import { useEffect, useRef, useState } from "react";
import { pdfjs } from "../../lib/pdf";

interface PdfPageBlockProps {
  pdf: pdfjs.PDFDocumentProxy;
  pageNumber: number;
  width: number;
  aspectRatio: number;
}

export default function PdfPageBlock({
  pdf,
  pageNumber,
  width,
  aspectRatio,
}: PdfPageBlockProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  // Рендерим только если страница рядом с вьюпортом
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setVisible(e.isIntersecting);
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let task: pdfjs.RenderTask | null = null;

    const run = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const base = page.getViewport({ scale: 1 });
        const scale = width / base.width;
        const viewport = page.getViewport({ scale });

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined;

        task = page.render({
          canvasContext: ctx,
          viewport,
          transform,
        } as any);

        await task.promise;
      } catch (e: any) {
        if (e?.name === "RenderingCancelledException") return;
        console.error("Ошибка рендера страницы", pageNumber, e);
      }
    };

    run();

    return () => {
      cancelled = true;
      try {
        task?.cancel();
      } catch {
        /* noop */
      }
    };
  }, [visible, pdf, pageNumber, width]);

  const height = Math.floor(width * aspectRatio);

  return (
    <div
      ref={wrapperRef}
      style={{
        width,
        height,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      {visible && <canvas ref={canvasRef} />}
    </div>
  );
}
