import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import GuestOnlyRoute from "./components/GuestOnlyRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import StreakToast from "./components/StreakToast/StreakToast";
import ExpBoostBadge from "./components/ExpBoostBadge/ExpBoostBadge";
import AchievementRouteSync from "./components/AchievementRouteSync/AchievementRouteSync";
import { AchievementsProvider } from "./context/AchievementsProvider";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const CoursePage = lazy(() => import("./pages/CoursePage/CoursePage"));
const CourseTrainingPage = lazy(
  () => import("./pages/CoursePage/CourseTrainingPage"),
);
const ItemPage = lazy(() => import("./pages/ItemPage/ItemPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage/LibraryPage"));
const LibraryViewPage = lazy(
  () => import("./pages/LibraryPage/LibraryViewPage"),
);
const PracticePage = lazy(() => import("./pages/PracticePage/PracticePage"));
const BreakdownsPage = lazy(
  () => import("./pages/BreakdownsPage/BreakdownsPage"),
);
const BreakdownDetailPage = lazy(
  () => import("./pages/BreakdownsPage/BreakdownDetailPage"),
);
const ShopPage = lazy(() => import("./pages/ShopPage/ShopPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));

const AlphabetPage = lazy(() => import("./pages/AlphabetPage/AlphabetPage"));
const AlphabetTestPage = lazy(
  () => import("./pages/AlphabetPage/Test/AlphabetTestPage"),
);

const LoginPage = lazy(() => import("./pages/AuthPage/LoginPage"));
const RegisterPage = lazy(() => import("./pages/AuthPage/RegisterPage"));

function AppLoader() {
  return (
    <div className="app-loader" role="status" aria-live="polite">
      <span className="state-block__spinner" aria-hidden="true" />
      <span>Загрузка…</span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AchievementsProvider>
        <AchievementRouteSync />
        <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/course" element={<CoursePage />} />
            <Route path="/breakdowns" element={<BreakdownsPage />} />
            <Route
              path="/breakdowns/:id"
              element={<BreakdownDetailPage />}
            />
            <Route
              path="/course/review"
              element={<CourseTrainingPage mode="review" />}
            />
            <Route
              path="/course/errors"
              element={<CourseTrainingPage mode="errors" />}
            />
            <Route path="/course/item/:id" element={<ItemPage />} />

            <Route path="/alphabet" element={<AlphabetPage />} />
            <Route
              path="/alphabet/test/:category"
              element={
                <ProtectedRoute>
                  <AlphabetTestPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library/:id"
              element={
                <ProtectedRoute>
                  <LibraryViewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice"
              element={
                <ProtectedRoute>
                  <PracticePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <ShopPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <LoginPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnlyRoute>
                <RegisterPage />
              </GuestOnlyRoute>
            }
          />
        </Routes>
          <StreakToast />
          <ExpBoostBadge />
        </Suspense>
      </AchievementsProvider>
    </BrowserRouter>
  );
}

export default App;
