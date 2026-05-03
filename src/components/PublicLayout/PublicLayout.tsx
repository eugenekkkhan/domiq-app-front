import type { CSSProperties, ReactNode } from "react";
import { NavLink, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const navLinkStyle = ({ isActive }: { isActive: boolean }): CSSProperties => ({
  color: isActive ? "var(--color-primary)" : "#8e8e93",
});

const Header = () => (
  <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
    <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <NavLink to="/" end style={{ color: "var(--color-primary)" }} className="font-bold text-lg tracking-tight">
        DOMIQ
      </NavLink>
      <nav className="flex items-center gap-4">
        <NavLink to="/news" className="text-sm font-medium" style={navLinkStyle}>Новости</NavLink>
        <NavLink to="/videos" className="text-sm font-medium" style={navLinkStyle}>Видео</NavLink>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-100">
    <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-center">
      <p className="text-xs text-gray-400">© {new Date().getFullYear()} DOMIQ</p>
    </div>
  </footer>
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
  <div className="min-h-screen bg-[#efeff4] flex flex-col">
    <Header />
    <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 flex flex-col gap-4">
      {showBack && <BackButton />}
      {children}
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
