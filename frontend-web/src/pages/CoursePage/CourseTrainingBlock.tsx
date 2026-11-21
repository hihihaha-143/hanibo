import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const TRAININGS = [
  {
    to: "/course/review",
    title: "Повторение",
    description: "Задания по последним пройденным урокам — освежить слова и грамматику.",
    icon: <RotateCcw size={22} />,
    tone: "review",
  },
  {
    to: "/course/errors",
    title: "Работа над ошибками",
    description: "Слова и грамматика, в которых были ошибки в тренировках и тестах.",
    icon: <AlertTriangle size={22} />,
    tone: "errors",
  },
];

export default function CourseTrainingBlock() {
  return (
    <section className="course-training-block" aria-label="Дополнительные тренировки">
      <h2 className="course-training-block__title">Тренировки</h2>
      <p className="course-training-block__intro">
        Материалы собираются автоматически из уже пройденного и твоих ошибок.
      </p>

      <div className="course-training-block__grid">
        {TRAININGS.map((training) => (
          <Link
            key={training.to}
            to={training.to}
            className={`card course-training-block__card course-training-block__card--${training.tone}`}
          >
            <span className="course-training-block__icon">{training.icon}</span>
            <span className="course-training-block__card-body">
              <strong>{training.title}</strong>
              <span>{training.description}</span>
            </span>
            <ArrowRight size={18} className="course-training-block__arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}
