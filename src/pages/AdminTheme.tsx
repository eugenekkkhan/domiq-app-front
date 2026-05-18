import { useEffect, useState } from "react";
import { getTheme, updateTheme } from "../queries";
import type { Theme } from "../types/Theme";
import { applyTheme, DEFAULT_THEME } from "../utils/theme";
import AdminPage from "./AdminPage";
import AsyncView from "../components/AsyncView/AsyncView";

const LIGHT_FIELDS: { key: keyof Theme; label: string }[] = [
  { key: "light_primary", label: "Акцент" },
  { key: "light_bg", label: "Фон страницы" },
  { key: "light_card", label: "Карточка" },
  { key: "light_text", label: "Текст" },
  { key: "light_border", label: "Граница" },
  { key: "light_danger", label: "Ошибка" },
  { key: "light_success", label: "Успех" },
];

const DARK_FIELDS: { key: keyof Theme; label: string }[] = [
  { key: "dark_primary", label: "Акцент" },
  { key: "dark_bg", label: "Фон страницы" },
  { key: "dark_card", label: "Карточка" },
  { key: "dark_text", label: "Текст" },
  { key: "dark_border", label: "Граница" },
  { key: "dark_danger", label: "Ошибка" },
  { key: "dark_success", label: "Успех" },
];

const ColorRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center justify-between gap-3 p-[var(--spacing-card)] border-b border-border last:border-0">
    <span className="text-sm">{label}</span>
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-7 h-7 rounded-inner border border-border overflow-hidden">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 cursor-pointer"
        />
      </div>
      <span className="text-xs text-gray-400 font-mono w-[52px]">{value}</span>
    </div>
  </div>
);

const isDefault = (theme: Theme) =>
  (Object.keys(DEFAULT_THEME) as (keyof typeof DEFAULT_THEME)[]).every(
    (k) => theme[k] === DEFAULT_THEME[k],
  );

const isDirty = (a: Theme, b: Theme) =>
  (Object.keys(DEFAULT_THEME) as (keyof typeof DEFAULT_THEME)[]).some(
    (k) => a[k] !== b[k],
  );

const AdminTheme = () => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [saved_theme, setSavedTheme] = useState<Theme | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const loadTheme = () => {
    setError("");
    setTheme(null);
    getTheme().then((res) => {
      const t = res.data as Theme;
      setTheme(t);
      setSavedTheme(t);
    }).catch(() => {
      setError("Не удалось загрузить тему");
    });
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const set = (key: keyof Theme, value: string) => {
    setTheme((t) => {
      if (!t) return t;
      const next = { ...t, [key]: value };
      applyTheme(next);
      return next;
    });
  };

  const handleSave = () => {
    if (!theme) return;
    setSaving(true);
    setError("");
    updateTheme(theme)
      .then(() => {
        setSavedTheme(theme);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch(() => {
        setError("Не удалось сохранить тему");
      })
      .finally(() => setSaving(false));
  };

  const handleReset = () => {
    if (!theme) return;
    const reset: Theme = { ...DEFAULT_THEME, id: theme.id };
    setTheme(reset);
    applyTheme(reset);
  };

  if (!theme)
    return (
      <AdminPage>
        <AsyncView loading={!error} error={error} onRetry={loadTheme}>{null}</AsyncView>
      </AdminPage>
    );

  return (
    <AdminPage>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold text-base">Тема оформления</h2>
        <div className="flex gap-2">
          {!isDefault(theme) && (
            <button
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={saving}
            >
              Сбросить
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !saved_theme || !isDirty(theme, saved_theme)}
          >
            {saved ? "Сохранено ✓" : saving ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
            Светлая тема
          </p>
          <div className="card overflow-hidden">
            {LIGHT_FIELDS.map(({ key, label }) => (
              <ColorRow
                key={key}
                label={label}
                value={theme[key] as string}
                onChange={(v) => set(key, v)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
            Тёмная тема
          </p>
          <div className="card overflow-hidden">
            {DARK_FIELDS.map(({ key, label }) => (
              <ColorRow
                key={key}
                label={label}
                value={theme[key] as string}
                onChange={(v) => set(key, v)}
              />
            ))}
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminTheme;
