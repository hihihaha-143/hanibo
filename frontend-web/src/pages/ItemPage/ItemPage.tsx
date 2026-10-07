import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getCourseItem,
  getCourseItems,
  type CourseItem,
  type CourseItemDetails,
} from "../../api/course";
import { getItemStatus } from "../../utils/courseStatus";
import ExtraView from "./ExtraView/ExtraView";
import LessonView from "./LessonView/LessonView";
import CourseTestView from "./CourseTestView/CourseTestView";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<CourseItemDetails | null>(null);
  const [items, setItems] = useState<CourseItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const [details, list] = await Promise.all([
          getCourseItem(Number(id)),
          getCourseItems(),
        ]);
        setItem(details);
        setItems(list);
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

  if (error || !item || !items) {
    return (
      <div className="item-page item-page--error">
        <p>Не удалось загрузить материал.</p>
        <Link to="/course" className="item-page__back">
          ← Назад к курсу
        </Link>
      </div>
    );
  }

  const status = getItemStatus(items, item.id);

  if (status === "locked") {
    return (
      <div className="item-page item-page--locked">
        <p>Урок заблокирован, пройди предыдущие.</p>
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

  if (item.type === "test") {
    return <CourseTestView item={item} />;
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
