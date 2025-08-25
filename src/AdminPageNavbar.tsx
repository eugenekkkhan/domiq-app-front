import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { themeParams } from "@telegram-apps/sdk";
import Stack from "@mui/material/Stack";
import Statistics from "./components/AdminPanel/Modals/Statistics/Statistics";
import Mailing from "./components/AdminPanel/Modals/Mailing/Mailing";
import { NavLink } from "react-router";

const AdminPageNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
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
          backgroundColor: themeParams.sectionBackgroundColor(),
          padding: "0 12px",
          zIndex: "100",
        }}
      >
        <p>Админ-панель</p>
        {isMenuOpen ? (
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setIsMenuOpen(false)}
          />
        ) : (
          <MenuIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setIsMenuOpen(true)}
          />
        )}
      </div>
      <Stack
        sx={{
          display: "flex",
          position: "fixed",
          justifyContent: "center",
          alignItems: "center",
          right: isMenuOpen ? "0" : "-280px",
          top: "64px",
          height: "calc(100vh - 64px - 40px)",
          width: "200px",
          backgroundColor: themeParams.headerBackgroundColor(),
          padding: "20px",
          zIndex: "90",
          transition: "right 0.3s ease",
        }}
      >
        <Stack spacing={8}>
          <Statistics>
            <p
              style={{
                fontSize: "20px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Статистика
            </p>
          </Statistics>
          <NavLink to="/admin">
            <p
              style={{ fontSize: "20px", textAlign: "center", cursor: "pointer" }}
            >
              Статьи
            </p>
          </NavLink>
          <NavLink to="/admin/videos">
            <p
              style={{ fontSize: "20px", textAlign: "center", cursor: "pointer" }}
            >
              Видео
            </p>
          </NavLink>
          <NavLink to="/admin/news">
            <p
              style={{ fontSize: "20px", textAlign: "center", cursor: "pointer" }}
            >
              Новости
            </p>
          </NavLink>
          <Mailing>
            <p
              style={{
                fontSize: "20px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Рассылка
            </p>
          </Mailing>
        </Stack>
      </Stack>
    </>
  );
};

export default AdminPageNavbar;
