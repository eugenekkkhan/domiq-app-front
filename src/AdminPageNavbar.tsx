import { useState } from "react";
import { NavLink } from "react-router";
import {
  Menu,
  X,
  FileText,
  Newspaper,
  Video,
  LayoutGrid,
  ImageIcon,
  Palette,
  Settings,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { removeToken, isAdmin, getNickname, getRole, removeNickname } from "./utils/auth";
import { useThemeMode } from "./utils/theme";
import { useSidebar } from "./contexts/SidebarContext";

const allNavItems = [
  { to: "/admin/articles", label: "Статьи", Icon: FileText, adminOnly: false },
  { to: "/admin/news", label: "Новости", Icon: Newspaper, adminOnly: false },
  { to: "/admin/videos", label: "Видео", Icon: Video, adminOnly: false },
  { to: "/admin/sections", label: "Разделы", Icon: LayoutGrid, adminOnly: false },
  { to: "/admin/media", label: "Медиа", Icon: ImageIcon, adminOnly: false },
  { to: "/admin/theme", label: "Тема", Icon: Palette, adminOnly: true },
  { to: "/admin/settings", label: "Настройки", Icon: Settings, adminOnly: true },
  { to: "/admin/supervisors", label: "Модераторы", Icon: ShieldCheck, adminOnly: true },
];

const roleLabel: Record<string, string> = {
  admin: "Администратор",
  moderator: "Модератор",
};

const SidebarContent = ({ onNav }: { onNav?: () => void }) => {
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin());
  const { mode, toggle } = useThemeMode();
  const nickname = getNickname();
  const role = getRole();
  const handleLogout = () => {
    removeToken();
    removeNickname();
    window.location.href = "/admin";
  };

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-inner text-sm font-medium transition-colors ${
                isActive ? "bg-bg text-primary" : "text-text/70 hover:bg-bg"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </div>
      <div className="p-3 border-t border-border flex flex-col gap-0.5">
        {(nickname || role) && (
          <div className="flex items-center gap-2 px-3 py-2 mb-0.5">
            {nickname && (
              <span className="text-sm font-medium text-text truncate flex-1 min-w-0">
                {nickname}
              </span>
            )}
            {role && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                role === "admin"
                  ? "bg-primary/15 text-primary"
                  : "bg-gray-400/15 text-gray-400"
              }`}>
                {roleLabel[role] ?? role}
              </span>
            )}
          </div>
        )}
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-inner text-sm font-medium text-text/60 hover:bg-bg transition-colors cursor-pointer"
        >
          {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          {mode === "dark" ? "Светлая тема" : "Тёмная тема"}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-inner text-sm font-medium text-danger hover:bg-danger/10 transition-colors cursor-pointer"
        >
          <LogOut size={17} />
          Выйти
        </button>
      </div>
    </nav>
  );
};

const AdminPageNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <span className="font-semibold text-base">Админ-панель</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 cursor-pointer"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed top-14 right-0 bottom-0 w-52 bg-card z-40 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <SidebarContent onNav={() => setIsOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden md:flex fixed top-0 left-0 bottom-0 bg-card border-r border-border z-40 flex-col transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "w-52" : "w-0"
        }`}
      >
        <div className="p-4 border-b border-border">
          <p className="font-bold text-base">Админ-панель</p>
        </div>
        {isSidebarOpen && <SidebarContent />}
      </div>

      {/* Toggle sidebar button */}
      <button
        onClick={toggleSidebar}
        className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-50 p-2 bg-card border border-border border-l-0 rounded-r-inner text-text/60 hover:text-text hover:bg-bg transition-colors cursor-pointer"
        style={{
          left: isSidebarOpen ? "208px" : "0",
          transition: "left 300ms",
        }}
        title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </>
  );
};

export default AdminPageNavbar;
