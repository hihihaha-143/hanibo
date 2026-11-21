import { useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { syncCourseProgressFromServer } from "../../utils/progress";

export default function CourseProgressSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    void syncCourseProgressFromServer();
  }, [user]);

  return null;
}
