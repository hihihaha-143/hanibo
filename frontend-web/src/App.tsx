import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import CoursePage from "./pages/CoursePage/CoursePage";

function Empty() {
  return <div>Пустая страница</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/course" element={<CoursePage />} />
        </Route>
        <Route path="/login" element={<Empty />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
