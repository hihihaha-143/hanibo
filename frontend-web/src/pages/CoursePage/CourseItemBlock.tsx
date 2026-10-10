import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import blueberryIcon from "../../assets/blueberry.png";
import strawberryIcon from "../../assets/strawberry.png";
import type { CourseItem } from "../../api/course";
import type { CourseItemStatus } from "../../utils/courseStatus";
import { spring } from "../../lib/motion";

export type { CourseItemStatus };

interface CourseItemBlockProps {
  item: CourseItem;
  status: CourseItemStatus;
  progressPercent: number;
  onClick?: () => void;
}

export default function CourseItemBlock({
  item,
  status,
  progressPercent,
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

  const isDisabled = status === "locked";
  const showFill = status === "partial";

  const buttonStyle: CSSProperties | undefined = showFill
    ? ({ "--fill-percent": `${progressPercent}%` } as CSSProperties)
    : undefined;

  return (
    <motion.button
      type="button"
      className={`course-item-block course-item-block--${item.type} course-item-block--${status}`}
      onClick={onClick}
      disabled={isDisabled}
      title={item.title}
      style={buttonStyle}
      whileHover={isDisabled ? undefined : { x: 4 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={spring.bouncy}
    >
      {showFill && (
        <span className="course-item-block__fill" aria-hidden="true" />
      )}
      <span className="course-item-block__inner">
        <span className="course-item-block__icon">{icon}</span>
      </span>
      <span className="course-item-block__title">{item.title}</span>
    </motion.button>
  );
}
