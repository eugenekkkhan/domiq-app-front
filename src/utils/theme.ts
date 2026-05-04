import { useEffect, useState } from "react";
import type { Theme } from "../types/Theme";

export const DEFAULT_THEME: Omit<Theme, "id"> = {
  light_primary: "#007aff",
  light_bg:      "#efeff4",
  light_card:    "#ffffff",
  light_text:    "#1c1c1e",
  light_border:  "#c8c7cc",
  light_danger:  "#ff3b30",
  light_success: "#34c759",
  dark_primary:  "#0a84ff",
  dark_bg:       "#1c1c1e",
  dark_card:     "#2c2c2e",
  dark_text:     "#ffffff",
  dark_border:   "#38383a",
  dark_danger:   "#ff453a",
  dark_success:  "#32d74b",
};

const MODE_KEY = "cms_color_mode";
const MODE_EVENT = "cms-theme-mode";

let _theme: Theme | Omit<Theme, "id"> | null = null;

export const getMode = (): "light" | "dark" => {
  const stored = localStorage.getItem(MODE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyTheme = (theme: Theme | Omit<Theme, "id">, mode?: "light" | "dark") => {
  _theme = theme;
  const m = mode ?? getMode();
  const root = document.documentElement;
  const vars: Record<string, string> = m === "dark"
    ? {
        "--color-primary": theme.dark_primary,
        "--color-bg":      theme.dark_bg,
        "--color-card":    theme.dark_card,
        "--color-text":    theme.dark_text,
        "--color-border":  theme.dark_border,
        "--color-danger":  theme.dark_danger,
        "--color-success": theme.dark_success,
      }
    : {
        "--color-primary": theme.light_primary,
        "--color-bg":      theme.light_bg,
        "--color-card":    theme.light_card,
        "--color-text":    theme.light_text,
        "--color-border":  theme.light_border,
        "--color-danger":  theme.light_danger,
        "--color-success": theme.light_success,
      };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
};

export const toggleMode = () => {
  const next = getMode() === "light" ? "dark" : "light";
  localStorage.setItem(MODE_KEY, next);
  if (_theme) applyTheme(_theme, next);
  window.dispatchEvent(new CustomEvent(MODE_EVENT, { detail: next }));
};

export const useThemeMode = () => {
  const [mode, setMode] = useState<"light" | "dark">(getMode);

  useEffect(() => {
    const handler = (e: Event) => setMode((e as CustomEvent<"light" | "dark">).detail);
    window.addEventListener(MODE_EVENT, handler);
    return () => window.removeEventListener(MODE_EVENT, handler);
  }, []);

  return { mode, toggle: toggleMode };
};
