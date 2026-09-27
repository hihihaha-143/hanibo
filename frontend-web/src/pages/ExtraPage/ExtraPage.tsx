import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getCourseItem,
  type CourseItemDetails,
  type CourseItemType,
} from "../../api/course";
import ExtraContentBlock from "./ExtraContentBlock";

function buildUrl(type: CourseItemType, id: number): string {
  switch (type) {
    case "extra":
      return `/course/extra/${id}`;
    case "lesson":
      return `/course/lesson/${id}`;
    case "test":
      return `/course/test/${id}`;
  }
}

export default function ExtraPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<CourseItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await getCourseItem(Number(id));
        setItem(data);
      } catch (e) {
        console.error("Не удалось загрузить доп:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <div className="extra-page extra-page--loading">Загрузка...</div>;
  }

  if (error || !item || !item.extra) {
    return (
      <div className="extra-page extra-page--error">
        <p>Не удалось загрузить материал.</p>
        <Link to="/course" className="extra-page__back">
          ← Назад к курсу
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    if (item.next) {
      navigate(buildUrl(item.next.type, item.next.id));
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
