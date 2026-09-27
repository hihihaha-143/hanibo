import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import MobileNav from "./MobileNav/MobileNav";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-layout__content">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
