import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import BackLink from "../../components/BackLink/BackLink";
import StateBlock from "../../components/StateBlock/StateBlock";

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
    return (
      <div className="page item-page item-page--state">
        <StateBlock variant="loading" text="Загружаем материал…" />
      </div>
    );
  }

  if (error || !item || !items) {
    return (
      <div className="page item-page item-page--state">
        <StateBlock variant="error" text="Не удалось загрузить материал." />
        <BackLink to="/course">Назад к курсу</BackLink>
      </div>
    );
  }

  const status = getItemStatus(items, item.id);

  if (status === "locked") {
    return (
      <div className="page item-page item-page--state">
        <StateBlock
          variant="empty"
          text="Урок заблокирован. Пройдите предыдущие материалы."
        />
        <BackLink to="/course">Назад к курсу</BackLink>
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
    <div className="page item-page item-page--state">
      <StateBlock variant="empty" text="Этот тип материала пока не поддерживается." />
      <BackLink to="/course">Назад к курсу</BackLink>
    </div>
  );
}
