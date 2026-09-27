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
const handleClick = (item: CourseItem) => {
  switch (item.type) {
    case "extra":
      navigate(`/course/extra/${item.id}`);
      break;
    case "lesson":
      navigate(`/course/lesson/${item.id}`);
      break;
    case "test":
      navigate(`/course/test/${item.id}`);
      break;
  }
};