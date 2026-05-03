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
  LogOut,
} from "lucide-react";
import { removeToken } from "./utils/auth";

const navItems = [
  { to: "/admin/articles", label: "Статьи", Icon: FileText },
  { to: "/admin/news", label: "Новости", Icon: Newspaper },
  { to: "/admin/videos", label: "Видео", Icon: Video },
  { to: "/admin/sections", label: "Разделы", Icon: LayoutGrid },
  { to: "/admin/media", label: "Медиа", Icon: ImageIcon },
];

const SidebarContent = ({ onNav }: { onNav?: () => void }) => {
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
                  ? "bg-[#efeff4] text-primary"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-inner text-sm font-medium text-danger hover:bg-red-50 transition-colors cursor-pointer"
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
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
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
        className={`md:hidden fixed top-14 right-0 bottom-0 w-52 bg-white z-40 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <SidebarContent onNav={() => setIsOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 bottom-0 w-52 bg-white border-r border-gray-200 z-40 flex-col">
        <div className="p-4 border-b border-gray-200">
          <p className="font-bold text-base">Админ-панель</p>
        </div>
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminPageNavbar;
