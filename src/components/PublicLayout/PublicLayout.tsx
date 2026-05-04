import type { CSSProperties, ReactNode } from "react";
import { NavLink, useNavigate } from "react-router";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useThemeMode } from "../../utils/theme";
import { useSettings } from "../../utils/settings";

const navLinkStyle = ({ isActive }: { isActive: boolean }): CSSProperties => ({
  color: isActive ? "var(--color-primary)" : "#8e8e93",
});

const ThemeToggle = () => {
  const { mode, toggle } = useThemeMode();
  return (
    <button
      onClick={toggle}
      className="rounded-inner text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
    >
      {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

const Header = () => {
  const settings = useSettings();
  const projectName = settings?.project_name ?? "DOMIQ";
  const logoUrl = settings?.logo_url;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink
          to="/"
          end
          style={logoUrl ? undefined : { color: "var(--color-primary)" }}
          className="font-bold text-lg tracking-tight"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={projectName}
              className="h-8 w-auto object-contain"
            />
          ) : (
            projectName
          )}
        </NavLink>
        <nav className="flex items-center gap-4">
          <NavLink
            to="/news"
            className="text-sm font-medium"
            style={navLinkStyle}
          >
            Новости
          </NavLink>
          <NavLink
            to="/videos"
            className="text-sm font-medium"
            style={navLinkStyle}
          >
            Видео
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-center">
      <p className="text-xs text-gray-400">
        © {new Date().getFullYear()} DOMIQ
      </p>
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
  <div className="min-h-screen bg-bg flex flex-col">
    <Header />
    <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 flex flex-col gap-4">
      {showBack && <BackButton />}
      {children}
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
