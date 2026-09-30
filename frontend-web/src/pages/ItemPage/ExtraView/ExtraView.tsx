import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CourseItemDetails } from "../../../api/course";
import ExtraContentBlock from "./ExtraContentBlock";

interface ExtraViewProps {
  item: CourseItemDetails;
}

export default function ExtraView({ item }: ExtraViewProps) {
  const navigate = useNavigate();

  if (!item.extra) {
    return (
      <div className="extra-page extra-page--error">
        <p>У этого материала нет содержимого.</p>
        <Link to="/course" className="extra-page__back">
          ← Назад к курсу
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    if (item.next) {
      navigate(`/course/item/${item.next.id}`);
    }
  };

  return (
    <div className="extra-page">
      <Link to="/course" className="extra-page__back">
        <ArrowLeft size={18} />
        <span>Назад к курсу</span>
      </Link>

      <h1 className="extra-page__title">{item.extra.title}</h1>

      <ExtraContentBlock content={item.extra.content} />

      {item.next && (
        <div className="extra-page__footer">
          <button
            type="button"
            className="extra-page__next"
            onClick={handleNext}
          >
            <span>{item.next.title}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
