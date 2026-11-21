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

const STATUS_LABELS: Record<CourseItemStatus, string> = {
  locked: "заблокировано",
  active: "доступно",
  partial: "в процессе",
  complete: "завершено",
};

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
            alt=""
            className="course-item-block__image"
          />
        );
      case "test":
        return (
          <img
            src={strawberryIcon}
            alt=""
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

  const hint = isDisabled
    ? `${item.title} — заблокировано, пройдите предыдущий материал`
    : `${item.title} — ${STATUS_LABELS[status]}`;

  return (
    <motion.button
      type="button"
      className={`course-item-block course-item-block--${status}`}
      onClick={onClick}
      disabled={isDisabled}
      title={hint}
      aria-label={hint}
      style={buttonStyle}
      whileHover={isDisabled ? undefined : { x: 4 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={spring.bouncy}
    >
      {showFill && (
        <span className="course-item-block__fill" aria-hidden="true" />
      )}
      {status === "complete" && (
        <span className="course-item-block__shine" aria-hidden="true" />
      )}
      <span className="course-item-block__inner" aria-hidden="true">
        <span className="course-item-block__icon">{icon}</span>
      </span>
      <span className="course-item-block__title">{item.title}</span>
    </motion.button>
  );
}
