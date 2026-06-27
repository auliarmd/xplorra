
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Masuk from "./pages/Masuk";
import DashboardAfterLogin from "./pages/DashboardAfterLogin";
import Detail from "./pages/Detail";
import Tambah from "./pages/Tambah";
import Profil from "./pages/Profil";
import Notifikasi from "./pages/Notifikasi";
import Feedback from "./pages/Feedback";
import EditResep from "./pages/EditResep";
import LupaPassword from "./pages/LupaPassword";
import DashboardMobile from "./pages/DashboardMobile";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isMobile ? <DashboardMobile /> : <Dashboard />}
        />
        <Route path="/masuk" element={<Masuk />} />
        <Route path="/dashboardafterlogin" element={<DashboardAfterLogin />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/tambah" element={<Tambah />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/notifikasi" element={<Notifikasi />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/edit/:id" element={<EditResep />} />
        <Route path="/lupapassword" element={<LupaPassword />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;