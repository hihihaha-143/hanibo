import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CourseItemDetails } from "../../../api/course";
import ExtraContentBlock from "./ExtraContentBlock";
import { spring } from "../../../lib/motion";

const MotionLink = motion.create(Link);

interface ExtraViewProps {
  item: CourseItemDetails;
}

export default function ExtraView({ item }: ExtraViewProps) {
  const navigate = useNavigate();

  if (!item.extra) {
    return (
      <div className="extra-page extra-page--error">
        <p>У этого материала нет содержимого.</p>
        <MotionLink
          to="/course"
          className="extra-page__back"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={spring.bouncy}
        >
          ← Назад к курсу
        </MotionLink>
      </div>
    );
  }

  const handleNext = () => {
    if (item.next) {
      navigate(`/course/item/${item.next.id}`);
    }
  };

  return (
    <div className="extra-page">
      <MotionLink
        to="/course"
        className="extra-page__back"
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={spring.bouncy}
      >
        <ArrowLeft size={18} />
        <span>Назад к курсу</span>
      </MotionLink>

      <h1 className="extra-page__title">{item.extra.title}</h1>

      <ExtraContentBlock content={item.extra.content} />

      {item.next && (
        <div className="extra-page__footer">
          <motion.button
            type="button"
            className="extra-page__next"
            onClick={handleNext}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            <span>{item.next.title}</span>
            <ArrowRight size={18} />
          </motion.button>
        </div>
      )}
    </div>
  );
}
