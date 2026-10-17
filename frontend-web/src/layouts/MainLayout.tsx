import { Outlet } from "react-router-dom";
import Banner from "./Banner/Banner";
import Sidebar from "./Sidebar/Sidebar";
import MobileNav from "./MobileNav/MobileNav";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Banner />
      <Sidebar />
      <main className="main-layout__content">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
