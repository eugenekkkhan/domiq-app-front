import React from "react";
import { auth } from "./queries";
import { setCookie } from "./utils/utils";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const AdminAuth = () => {
  const [form, setForm] = React.useState({
    username: "",
    password: "",
    isError: false,
  });

  const handleForm = () => {
    auth(form.username, form.password)
      .then(() => {
        setForm({ ...form, isError: false });
        setCookie("token", btoa(`${form.username}:${form.password}`), 30);
        window.location.href = "/admin";
      })
      .catch(() => {
        setForm({ ...form, isError: true });
      });
  };
  return (
    <div
      style={{
        maxWidth: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxWidth: "480px",
          minWidth: "auto"
        }}
      >
        <h1>Вход в админ-панель</h1>
        <TextField
          label="Имя учетной записи"
          type="text"
          value={form.username}
          onChange={(event) => {
            setForm({ ...form, username: event.target.value });
          }}
        />
        <TextField
          type="password"
          label="Пароль"
          value={form.password}
          onChange={(event) => {
            setForm({ ...form, password: event.target.value });
          }}
        />
        <Button onClick={() => handleForm()}>Submit</Button>
        {form.isError && (
          <div style={{ color: "red" }}>Authentication failed</div>
        )}
      </div>
    </div>
  );
};

export default AdminAuth;
