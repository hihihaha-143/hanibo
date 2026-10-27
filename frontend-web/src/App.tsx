import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import GuestOnlyRoute from "./components/GuestOnlyRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import StreakToast from "./components/StreakToast/StreakToast";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const CoursePage = lazy(() => import("./pages/CoursePage/CoursePage"));
const ItemPage = lazy(() => import("./pages/ItemPage/ItemPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage/LibraryPage"));
import LibraryViewPage from "./pages/LibraryPage/LibraryViewPage";
const PracticePage = lazy(() => import("./pages/PracticePage/PracticePage"));

const AlphabetPage = lazy(() => import("./pages/AlphabetPage/AlphabetPage"));
const AlphabetTestPage = lazy(
  () => import("./pages/AlphabetPage/Test/AlphabetTestPage"),
);

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/course" element={<CoursePage />} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
