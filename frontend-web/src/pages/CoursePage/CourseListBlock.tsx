import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseItems, type CourseItem } from "../../api/course";
import CourseItemBlock from "./CourseItemBlock";

export default function CourseListBlock() {
  const navigate = useNavigate();
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

  const handleClick = (item: CourseItem) => {
    if (item.type === "extra") {
      navigate(`/course/extra/${item.id}`);
    }
    // урок и тест — позже
  };

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
        <CourseItemBlock
          key={item.id}
          item={item}
          onClick={() => handleClick(item)}
        />
      ))}
    </div>
  );
}
