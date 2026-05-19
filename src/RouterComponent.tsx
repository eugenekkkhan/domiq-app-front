import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import AdminAuth from "./AdminAuth";
import useCustomTheme from "./customHooks/useCustomTheme";
import Videos from "./pages/VideosPage";
import PlayerComponent from "./components/Player/Player";
import NewArticlePage from "./pages/NewArticlePage";
import Content from "./pages/Content/Content";
import AdminArticles from "./pages/AdminArticles";
import AdminNews from "./pages/AdminNews";
import AdminVideos from "./pages/AdminVideos";
import { getCookie } from "./utils/utils";
import { useBackButton } from "./customHooks/useBackButton";
import { useMaxBackButton } from "./customHooks/useMaxBackButton";
import MaxPage from "./pages/MaxPage";

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/max/*" element={<MaxRoutes />} />
        <Route path="/*" element={<MainRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

const MaxRoutes = () => {
  useMaxBackButton();
  return (
    <Routes>
      <Route index element={<MaxPage />} />
    </Routes>
  );
};

const MainRoutes = () => {
  useCustomTheme();
  useBackButton();
  const isAuthenticated = getCookie("token");
  return (
    <Routes>
      <Route
        path="/admin"
        element={isAuthenticated ? <AdminArticles /> : <AdminAuth />}
      />
      <Route
        path="/admin/news"
        element={isAuthenticated ? <AdminNews /> : <AdminAuth />}
      />
      <Route
        path="/admin/videos"
        element={isAuthenticated ? <AdminVideos /> : <AdminAuth />}
      />
      <Route path="/" element={<App />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/video/:videoLink" element={<PlayerComponent />} />
      <Route path="/news/:articleId" element={<NewArticlePage />} />
      <Route path="/content/:contentId" element={<Content />} />
    </Routes>
  );
};

export default RouterComponent;
