import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CourseItemDetails } from "../../../api/course";
import ExtraContentBlock from "./ExtraContentBlock";
import BackLink from "../../../components/BackLink/BackLink";
import StateBlock from "../../../components/StateBlock/StateBlock";
import { spring } from "../../../lib/motion";

interface ExtraViewProps {
  item: CourseItemDetails;
}

export default function ExtraView({ item }: ExtraViewProps) {
  const navigate = useNavigate();

  if (!item.extra) {
    return (
      <div className="page page--reading extra-page">
        <BackLink to="/course">Назад к курсу</BackLink>
        <StateBlock variant="empty" text="У этого материала нет содержимого." />
      </div>
    );
  }

  const handleNext = () => {
    if (item.next) {
      navigate(`/course/item/${item.next.id}`);
    }
  };

  return (
    <article className="page page--reading extra-page">
      <BackLink to="/course">Назад к курсу</BackLink>

      <header className="page__header">
        <h1 className="page__title">{item.extra.title}</h1>
      </header>

      <ExtraContentBlock content={item.extra.content} />

      {item.next && (
        <div className="actions">
          <motion.button
            type="button"
            className="btn btn--primary"
            onClick={handleNext}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={spring.bouncy}
          >
            <span>{item.next.title}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </motion.button>
        </div>
      )}
    </article>
  );
}
