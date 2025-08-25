import AdminPageNavbar from "../AdminPageNavbar";

const AdminPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexDirection: "column",
        top: "64px",
        paddingBottom: "24px",
        position: "relative",
      }}
    >
      <AdminPageNavbar />
      {children}
    </div>
  );
};

export default AdminPage;
