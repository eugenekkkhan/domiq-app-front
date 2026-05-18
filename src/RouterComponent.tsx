import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { isAuthenticated, isAdmin } from "./utils/auth";
import App from "./App";
import AdminAuth from "./AdminAuth";
import AdminArticles from "./pages/AdminArticles";
import AdminNews from "./pages/AdminNews";
import AdminVideos from "./pages/AdminVideos";
import AdminSections from "./pages/AdminSections";
import AdminMedia from "./pages/AdminMedia";
import AdminTheme from "./pages/AdminTheme";
import AdminSettings from "./pages/AdminSettings";
import AdminSupervisors from "./pages/AdminSupervisors";
import VideosPage from "./pages/VideosPage";
import PlayerComponent from "./components/Player/Player";
import NewArticlePage from "./pages/NewArticlePage";
import NewsPage from "./pages/NewsPage";
import SectionPage from "./pages/SectionPage";
import ArticlePage from "./pages/ArticlePage";

const RequireAuth = ({ children }: { children: React.ReactNode }) =>
  isAuthenticated() ? <>{children}</> : <Navigate to="/admin" replace />;

const RequireAdmin = ({ children }: { children: React.ReactNode }) =>
  isAdmin() ? <>{children}</> : <Navigate to="/admin/articles" replace />;

const RouterComponent = () => (
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/" element={<App />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:articleId" element={<NewArticlePage />} />
      <Route path="/sections/:sectionId" element={<SectionPage />} />
      <Route path="/articles/:articleId" element={<ArticlePage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/video/:videoId" element={<PlayerComponent />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={isAuthenticated() ? <Navigate to="/admin/articles" replace /> : <AdminAuth />}
      />
      <Route path="/admin/articles" element={<RequireAuth><AdminArticles /></RequireAuth>} />
      <Route path="/admin/news" element={<RequireAuth><AdminNews /></RequireAuth>} />
      <Route path="/admin/videos" element={<RequireAuth><AdminVideos /></RequireAuth>} />
      <Route path="/admin/sections" element={<RequireAuth><AdminSections /></RequireAuth>} />
      <Route path="/admin/media" element={<RequireAuth><AdminMedia /></RequireAuth>} />
      <Route path="/admin/theme" element={<RequireAuth><RequireAdmin><AdminTheme /></RequireAdmin></RequireAuth>} />
      <Route path="/admin/settings" element={<RequireAuth><RequireAdmin><AdminSettings /></RequireAdmin></RequireAuth>} />
      <Route path="/admin/supervisors" element={<RequireAuth><RequireAdmin><AdminSupervisors /></RequireAdmin></RequireAuth>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default RouterComponent;
