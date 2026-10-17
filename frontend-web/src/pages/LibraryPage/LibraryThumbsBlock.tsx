import type { pdfjs } from "../../lib/pdf";
import PdfThumbBlock from "./PdfThumbBlock";

interface LibraryThumbsBlockProps {
  pdf: pdfjs.PDFDocumentProxy;
  numPages: number;
  currentPage: number;
  onSelect: (page: number) => void;
}

export default function LibraryThumbsBlock({
  pdf,
  numPages,
  currentPage,
  onSelect,
}: LibraryThumbsBlockProps) {
  return (
    <div className="library-thumbs-block">
      {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
        <PdfThumbBlock
          key={pageNum}
          pdf={pdf}
          pageNumber={pageNum}
          isActive={pageNum === currentPage}
          onClick={() => onSelect(pageNum)}
        />
      ))}
    </div>
  );
}
