import { useEffect, useState } from "react";
import type { Settings } from "../types/Settings";

const SETTINGS_EVENT = "cms-settings-change";

let _settings: Settings | null = null;

export const getSettings = (): Settings | null => _settings;

const setMeta = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
};

const setMetaProperty = (property: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
};

export const applySettings = (settings: Settings) => {
  _settings = settings;

  document.title = settings.meta_title || settings.project_name;

  if (settings.favicon_url) {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = settings.favicon_url;
  }

  if (settings.meta_description) setMeta("description", settings.meta_description);
  if (settings.meta_keywords) setMeta("keywords", settings.meta_keywords);
  setMetaProperty("og:title", settings.meta_title || settings.project_name);
  if (settings.meta_description) setMetaProperty("og:description", settings.meta_description);
  if (settings.og_image_url) setMetaProperty("og:image", settings.og_image_url);

  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: settings }));
};

export const useSettings = (): Settings | null => {
  const [settings, setSettings] = useState<Settings | null>(_settings);

  useEffect(() => {
    const handler = (e: Event) =>
      setSettings((e as CustomEvent<Settings>).detail);
    window.addEventListener(SETTINGS_EVENT, handler);
    return () => window.removeEventListener(SETTINGS_EVENT, handler);
  }, []);

  return settings;
};
