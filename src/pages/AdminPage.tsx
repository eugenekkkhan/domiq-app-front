import AdminPageNavbar from "../AdminPageNavbar";
import type { ReactNode } from "react";
import { useSidebar } from "../contexts/SidebarContext";

const AdminPage = ({ children }: { children: ReactNode }) => {
  const { isOpen: isSidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-bg">
      <AdminPageNavbar />
      {/* md: offset for sidebar, mobile: offset for top bar */}
      <main
        className={`pt-18 md:pt-4 p-4 flex flex-col justify-center items-center transition-all duration-300 ${
          isSidebarOpen ? "md:ml-52" : "md:ml-0"
        }`}
      >
        <div className="w-full max-w-4xl flex flex-col gap-3">{children}</div>
      </main>
    </div>
  );
};

export default AdminPage;
