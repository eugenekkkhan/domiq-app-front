import AdminPageNavbar from "../AdminPageNavbar";
import type { ReactNode } from "react";

const AdminPage = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-bg">
      <AdminPageNavbar />
      {/* md: offset for sidebar, mobile: offset for top bar */}
      <main className="pt-18 md:pt-4 p-4 flex flex-col justify-center items-center w-full">
        <div className="w-full max-w-4xl flex flex-col gap-3">{children}</div>
      </main>
    </div>
  );
};

export default AdminPage;
