import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const Header = () => (
  <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
    <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <NavLink to="/" className="font-bold text-lg tracking-tight text-primary">
        DOMIQ
      </NavLink>
      <nav className="flex items-center gap-4">
        <NavLink
          to="/news"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"}`
          }
        >
          Новости
        </NavLink>
        <NavLink
          to="/videos"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"}`
          }
        >
          Видео
        </NavLink>
      </nav>
    </div>
  </header>
);

export const BackButton = ({ label = "Назад" }: { label?: string }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 text-primary text-sm font-medium cursor-pointer"
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
};

const PublicLayout = ({
  children,
  showBack = false,
}: {
  children: ReactNode;
  showBack?: boolean;
}) => (
  <div className="min-h-screen bg-[#efeff4]">
    <Header />
    <main className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">
      {showBack && <BackButton />}
      {children}
    </main>
  </div>
);

export default PublicLayout;
