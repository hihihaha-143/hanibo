import { useEffect, useState } from "react";
import { getCourseItems, type CourseItem } from "../../api/course";
import CourseItemBlock from "./CourseItemBlock";

export default function CourseListBlock() {
  const [items, setItems] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCourseItems();
        setItems(data);
      } catch (e) {
        console.error("Не удалось загрузить курс:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="course-list-block course-list-block--loading">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="course-list-block">
      {items.map((item) => (
        <CourseItemBlock key={item.id} item={item} />
      ))}
    </div>
  );
}
