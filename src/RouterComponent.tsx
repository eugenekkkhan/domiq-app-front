import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import AdminPage from "./AdminPage";
import AdminAuth from "./AdminAuth";
import { getCookie } from "./utils";
import ConnectionProblems from "./pages/ConnectionProblemsPage";
import Faq from "./pages/FaqPage";
import Features from "./pages/FeaturesPage";
import useCustomTheme from "./customHooks/useCustomTheme";
import Videos from "./pages/VideosPage";

const RouterComponent = () => {
  const isAuthenticated = getCookie("token");
  useCustomTheme();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminPage /> : <AdminAuth />}
        />
        <Route path="/connection-problems" element={<ConnectionProblems />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/features" element={<Features />} />
        <Route path="/videos" element={<Videos/ >} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
