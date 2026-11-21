import { useSearchParams } from "react-router-dom";
import ChipsBlock from "../../components/ChipsBlock/ChipsBlock";
import CourseListBlock from "./CourseListBlock";
import MyDictionaryBlock from "./MyDictionaryBlock";
import CourseStatsBlock from "./CourseStatsBlock";
import CourseTrainingBlock from "./CourseTrainingBlock";
import {
  COURSE_TABS,
  DEFAULT_COURSE_TAB,
  isCourseTabId,
  type CourseTabId,
} from "./courseTabs";

const TITLES: Record<CourseTabId, { title: string; subtitle: string }> = {
  course: {
    title: "Курс",
    subtitle: "Уроки, тесты и материалы по порядку",
  },
  dictionary: {
    title: "Мой словарь",
    subtitle: "Слова, фразы и грамматика, которые сейчас изучаются",
  },
  stats: {
    title: "Статистика",
    subtitle: "Прогресс курса, серия и рассчитанный уровень языка",
  },
};

export default function CoursePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: CourseTabId = isCourseTabId(rawTab)
    ? rawTab
    : DEFAULT_COURSE_TAB;

  const handleTabChange = (tab: CourseTabId) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next, { replace: false });
  };

  const header = TITLES[activeTab];

  return (
    <div className="page course-page">
      <header className="page__header course-page__header">
        <h1 className="page__title">{header.title}</h1>
        <p className="course-page__subtitle">{header.subtitle}</p>
      </header>

      <ChipsBlock
        tabs={COURSE_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        layoutId="course-chip-highlight"
      />

      <div className="course-page__content">
        {activeTab === "course" && (
          <>
            <CourseListBlock />
            <CourseTrainingBlock />
          </>
        )}
        {activeTab === "dictionary" && <MyDictionaryBlock />}
        {activeTab === "stats" && <CourseStatsBlock />}
      </div>
    </div>
  );
}
