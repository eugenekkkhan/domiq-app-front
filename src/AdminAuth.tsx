import { useState } from "react";
import { login } from "./queries";
import { setToken, setNickname } from "./utils/auth";

const AdminAuth = () => {
  const [form, setForm] = useState({ nickname: "", password: "", error: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    login(form.nickname, form.password)
      .then((res) => {
        setToken(res.data.token);
        setNickname(res.data.user.nickname);
        window.location.href = "/admin/articles";
      })
      .catch(() => {
        setForm((f) => ({ ...f, error: "Неверный логин или пароль" }));
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="card p-[var(--spacing-card)] w-full max-w-sm flex flex-col gap-3 shadow-sm">
        <h1 className="text-2xl font-bold text-center">Вход</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="input"
            placeholder="Имя пользователя"
            type="text"
            autoComplete="username"
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value, error: "" })}
            required
          />
          <input
            className="input"
            placeholder="Пароль"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value, error: "" })}
            required
          />
          {form.error && (
            <p className="text-sm text-danger text-center">{form.error}</p>
          )}
          <button
            className="btn btn-primary w-full mt-1"
            type="submit"
            disabled={loading || !form.nickname || !form.password}
          >
            {loading ? "Входим…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
