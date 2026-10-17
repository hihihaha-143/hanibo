import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseItems, type CourseItem } from "../../api/course";
import { calculateCourseStatuses } from "../../utils/courseStatus";
import CourseItemBlock from "./CourseItemBlock";
import StateBlock from "../../components/StateBlock/StateBlock";

export default function CourseListBlock() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getCourseItems();
      setItems(data);
    } catch (e) {
      console.error("Не удалось загрузить курс:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const itemsWithStatus = useMemo(
    () => calculateCourseStatuses(items),
    [items],
  );

  const handleClick = (item: CourseItem) => {
    if (
      item.type === "extra" ||
      item.type === "lesson" ||
      item.type === "test"
    ) {
      navigate(`/course/item/${item.id}`);
    }
  };

  if (loading) return <StateBlock variant="loading" />;
  if (error) return <StateBlock variant="error" onRetry={load} />;
  if (items.length === 0) return <StateBlock variant="empty" />;

  return (
    <div className="course-list-block">
      {itemsWithStatus.map(({ item, status, progressPercent }) => (
        <CourseItemBlock
          key={item.id}
          item={item}
          status={status}
          progressPercent={progressPercent}
          onClick={() => handleClick(item)}
        />
      ))}
    </div>
  );
}
