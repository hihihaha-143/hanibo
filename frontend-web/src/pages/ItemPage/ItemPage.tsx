import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
import { spring } from "../../lib/motion";

const MotionLink = motion.create(Link);

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
        <MotionLink
          to="/course"
          className="item-page__back"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={spring.bouncy}
        >
          ← Назад к курсу
        </MotionLink>
      </div>
    );
  }

  const status = getItemStatus(items, item.id);

  if (status === "locked") {
    return (
      <div className="item-page item-page--locked">
        <p>Урок заблокирован, пройди предыдущие.</p>
        <MotionLink
          to="/course"
          className="item-page__back"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={spring.bouncy}
        >
          ← Назад к курсу
        </MotionLink>
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
      <MotionLink
        to="/course"
        className="item-page__back"
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={spring.bouncy}
      >
        ← Назад к курсу
      </MotionLink>
    </div>
  );
}
