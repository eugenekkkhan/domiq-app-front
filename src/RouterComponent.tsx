import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import AdminAuth from "./AdminAuth";
import useCustomTheme from "./customHooks/useCustomTheme";
import Videos from "./pages/VideosPage";
import PlayerComponent from "./components/Player/Player";
import NewArticlePage from "./pages/NewArticlePage";
import Content from "./pages/ContentRouter/ContentRouter";
import { getAllSections } from "./queries";
import { useEffect, useState } from "react";
import AdminArticles from "./pages/AdminArticles";
import AdminNews from "./pages/AdminNews";
import AdminVideos from "./pages/AdminVideos";

const RouterComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname.includes("admin")) {
      getAllSections()
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false))
        .finally(() => setLoading(false));
    }
  }, [window.location.pathname]);

  useCustomTheme();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={
            !loading && (isAuthenticated ? <AdminArticles /> : <AdminAuth />)
          }
        />
        <Route
          path="/admin/news"
          element={
            !loading && (isAuthenticated ? <AdminNews /> : <AdminAuth />)
          }
        />
        <Route path="/admin/videos" element={
          !loading && (isAuthenticated ? <AdminVideos /> : <AdminAuth />)
        } />
        <Route path="/" element={<App />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/media/:videoLink" element={<PlayerComponent />} />
        <Route path="/news/:articleId" element={<NewArticlePage />} />
        <Route path="/content/:contentId" element={<Content />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
