import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ExtraContentBlockProps {
  content: string;
}

export default function ExtraContentBlock({ content }: ExtraContentBlockProps) {
  return (
    <div className="extra-content-block">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
