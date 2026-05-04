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
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { removeToken } from "./utils/auth";
import { useThemeMode } from "./utils/theme";

const navItems = [
  { to: "/admin/articles", label: "Статьи", Icon: FileText },
  { to: "/admin/news", label: "Новости", Icon: Newspaper },
  { to: "/admin/videos", label: "Видео", Icon: Video },
  { to: "/admin/sections", label: "Разделы", Icon: LayoutGrid },
  { to: "/admin/media", label: "Медиа", Icon: ImageIcon },
  { to: "/admin/theme", label: "Тема", Icon: Palette },
  { to: "/admin/settings", label: "Настройки", Icon: Settings },
];

const SidebarContent = ({ onNav }: { onNav?: () => void }) => {
  const { mode, toggle } = useThemeMode();
  const handleLogout = () => {
    removeToken();
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
                isActive
                  ? "bg-bg text-primary"
                  : "text-text/70 hover:bg-bg"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </div>
      <div className="p-3 border-t border-border flex flex-col gap-0.5">
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

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <span className="font-semibold text-base">Админ-панель</span>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 cursor-pointer">
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
      <div className="hidden md:flex fixed top-0 left-0 bottom-0 w-52 bg-card border-r border-border z-40 flex-col">
        <div className="p-4 border-b border-border">
          <p className="font-bold text-base">Админ-панель</p>
        </div>
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminPageNavbar;
