import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import AdminPage from "./pages/AdminPage";
import AdminAuth from "./AdminAuth";
import { getCookie } from "./utils/utils";
import ConnectionProblems from "./pages/ConnectionProblemsPage";
import Faq from "./pages/FaqPage";
import Features from "./pages/FeaturesPage";
import useCustomTheme from "./customHooks/useCustomTheme";
import Videos from "./pages/VideosPage";
import PlayerComponent from "./components/Player/Player";
import Article from "./pages/Article";
import NewArticlePage from "./pages/NewArticlePage";

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
        <Route path="/videos" element={<Videos />} />
        <Route path="/media/:videoLink" element={<PlayerComponent />} />
        <Route path="/article/:articleId" element={<Article />} />
        <Route path="/news/:articleId" element={<NewArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
