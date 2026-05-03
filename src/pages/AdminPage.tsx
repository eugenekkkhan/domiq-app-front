import AdminPageNavbar from "../AdminPageNavbar";
import type { ReactNode } from "react";

const AdminPage = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#efeff4]">
      <AdminPageNavbar />
      {/* md: offset for sidebar, mobile: offset for top bar */}
      <main className="md:ml-52 pt-14 md:pt-0 p-4 flex flex-col gap-3 max-w-4xl">
        {children}
      </main>
    </div>
  );
};

export default AdminPage;
