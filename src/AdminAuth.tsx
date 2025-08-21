import React from "react";
import { auth } from "./queries";
import { setCookie } from "./utils/utils";

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
    <div style={{ display: "flex", flexDirection: "column" }}>
      {import.meta.env.VITE_APPLICATION_API_LINK}
      <input
        type="text"
        value={form.username}
        onChange={(event) => {
          setForm({ ...form, username: event.target.value });
        }}
      />
      <input
        type="password"
        value={form.password}
        onChange={(event) => {
          setForm({ ...form, password: event.target.value });
        }}
      />
      <button onClick={() => handleForm()}>Submit</button>
      {form.isError && (
        <div style={{ color: "red" }}>Authentication failed</div>
      )}
    </div>
  );
};

export default AdminAuth;
