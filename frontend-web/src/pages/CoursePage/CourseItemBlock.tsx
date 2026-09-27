import blueberryIcon from "../../assets/blueberry.png";
import strawberryIcon from "../../assets/strawberry.png";
import type { CourseItem } from "../../api/course";

interface CourseItemBlockProps {
  item: CourseItem;
  onClick?: () => void;
}

export default function CourseItemBlock({
  item,
  onClick,
}: CourseItemBlockProps) {
  const icon = (() => {
    switch (item.type) {
      case "lesson":
        return <span className="course-item-block__number">{item.order}</span>;
      case "extra":
        return (
          <img
            src={blueberryIcon}
            alt="Доп. материал"
            className="course-item-block__image"
          />
        );
      case "test":
        return (
          <img
            src={strawberryIcon}
            alt="Тест"
            className="course-item-block__image"
          />
        );
    }
  })();

  return (
    <button
      type="button"
      className={`course-item-block course-item-block--${item.type}`}
      onClick={onClick}
      title={item.title}
    >
      <span className="course-item-block__icon">{icon}</span>
      <span className="course-item-block__title">{item.title}</span>
    </button>
  );
}
