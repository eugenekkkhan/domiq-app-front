const AdminPageNavbar = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        left: "0",
        top: "0",
        width: "calc(100% - 24px)",
        height: "64px",
        backgroundColor: "#f8f9fa",
        padding: "0 12px",
      }}
    >
      <p>AdminPage</p>
      <p>Статьи</p>
    </div>
  );
};

export default AdminPageNavbar;
