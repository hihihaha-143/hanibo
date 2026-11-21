import CourseListBlock from "./CourseListBlock";

export default function CoursePage() {
  return (
    <div className="page course-page">
      <header className="page__header">
        <h1 className="page__title">Курс</h1>
      </header>
      <CourseListBlock />
    </div>
  );
}
