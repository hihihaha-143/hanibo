import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseItem, type CourseItemDetails } from "../../api/course";
import ExtraView from "./ExtraView/ExtraView";
import LessonView from "./LessonView/LessonView";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
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
        console.error("Не удалось загрузить элемент курса:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <div className="item-page item-page--loading">Загрузка...</div>;
  }

  if (error || !item) {
    return (
      <div className="item-page item-page--error">
        <p>Не удалось загрузить материал.</p>
        <Link to="/course" className="item-page__back">
          ← Назад к курсу
        </Link>
      </div>
    );
  }

  if (item.type === "extra") {
    return <ExtraView item={item} />;
  }

  if (item.type === "lesson") {
    return <LessonView item={item} />;
  }

  return (
    <div className="item-page item-page--unknown">
      <p>Этот тип пока не поддерживается.</p>
      <Link to="/course" className="item-page__back">
        ← Назад к курсу
      </Link>
    </div>
  );
}
