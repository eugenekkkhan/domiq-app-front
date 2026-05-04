import { useEffect, useState } from "react";
import { getSettingsQuery, updateSettings } from "../queries";
import type { Settings } from "../types/Settings";
import type { Image } from "../types/Image";
import { applySettings } from "../utils/settings";
import { imageUrl } from "../utils/media";
import AdminPage from "./AdminPage";
import { ImagePicker } from "../components/ImagePicker/ImagePicker";

type PickerField = "logo_url" | "favicon_url" | "og_image_url";

const isDirty = (a: Settings, b: Settings) =>
  a.project_name !== b.project_name ||
  a.logo_url !== b.logo_url ||
  a.favicon_url !== b.favicon_url ||
  a.meta_title !== b.meta_title ||
  a.meta_description !== b.meta_description ||
  a.meta_keywords !== b.meta_keywords ||
  a.og_image_url !== b.og_image_url;

const InputRow = ({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) => (
  <div className="p-[var(--spacing-card)] border-b border-border last:border-0">
    <label className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-1.5">
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full text-sm bg-transparent outline-none resize-none"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm bg-transparent outline-none"
      />
    )}
  </div>
);

const ImagePickerField = ({
  label,
  hint,
  value,
  onPick,
  onClear,
}: {
  label: string;
  hint?: string;
  value: string | null;
  onPick: () => void;
  onClear: () => void;
}) => (
  <div className="flex items-center gap-3 p-[var(--spacing-card)] border-b border-border last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-sm">{label}</p>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {value ? (
        <>
          <img
            src={value}
            alt=""
            className="h-9 w-9 object-cover rounded-inner border border-border bg-gray-50"
          />
          <button
            onClick={onPick}
            className="text-xs text-primary font-medium cursor-pointer"
          >
            Изменить
          </button>
          <button
            onClick={onClear}
            className="text-xs text-danger font-medium cursor-pointer"
          >
            Убрать
          </button>
        </>
      ) : (
        <button
          onClick={onPick}
          className="btn btn-secondary text-xs py-1.5 px-3"
        >
          Выбрать
        </button>
      )}
    </div>
  </div>
);

const SeoPreview = ({
  title,
  description,
  projectName,
  faviconUrl,
}: {
  title: string;
  description: string;
  projectName: string;
  faviconUrl: string | null;
}) => (
  <div className="p-4 font-sans border border-border rounded-inner bg-white max-w-lg">
    <div className="flex items-center gap-2 mb-1">
      {faviconUrl ? (
        <img
          src={faviconUrl}
          alt=""
          className="w-7 h-7 rounded-full border object-cover"
        />
      ) : (
        <div className="w-4 h-4 rounded-sm bg-gray-200 shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-sm text-gray-800 truncate leading-tight">
          {projectName || "Название сайта"}
        </p>
        <p className="text-xs text-gray-500 truncate leading-tight">
          https://yourdomain.com
        </p>
      </div>
    </div>
    <p className="text-base text-blue-700 font-medium leading-snug mt-1 truncate">
      {title || projectName || "Заголовок страницы"}
    </p>
    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
      {description || "Описание страницы для поисковых систем..."}
    </p>
  </div>
);

const SocialPreview = ({
  title,
  description,
  projectName,
  ogImageUrl,
}: {
  title: string;
  description: string;
  projectName: string;
  ogImageUrl: string | null;
}) => (
  <div className="font-sans border border-border rounded-inner bg-white max-w-lg overflow-hidden">
    {ogImageUrl ? (
      <img
        src={ogImageUrl}
        alt=""
        className="w-full aspect-[1.91/1] object-cover object-center"
      />
    ) : (
      <div className="w-full aspect-[1.91/1] bg-gray-100 flex items-center justify-center">
        <p className="text-xs text-gray-400">OG Image не выбран</p>
      </div>
    )}
    <div className="px-3 py-2.5 border-t border-border">
      <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
        {window.location.host}
      </p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
        {title || projectName || "Заголовок страницы"}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
        {description || "Описание страницы для соцсетей..."}
      </p>
    </div>
  </div>
);

const AdminSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [savedSettings, setSavedSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pickerField, setPickerField] = useState<PickerField | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getSettingsQuery().then((res) => {
      const s = res.data as Settings;
      setSettings(s);
      setSavedSettings(s);
    }).catch(() => {
      setError("Не удалось загрузить настройки");
    });
  }, []);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  };

  const handlePickerSelect = (img: Image) => {
    if (pickerField) set(pickerField, imageUrl(img, "large"));
  };

  const handleSave = () => {
    if (!settings) return;
    setSaving(true);
    setError("");
    updateSettings(settings)
      .then((res) => {
        const updated = res.data as Settings;
        setSettings(updated);
        setSavedSettings(updated);
        applySettings(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch(() => {
        setError("Не удалось сохранить настройки");
      })
      .finally(() => setSaving(false));
  };

  if (!settings)
    return (
      <AdminPage>
        <p className="text-sm text-gray-400 text-center py-8">Загрузка…</p>
      </AdminPage>
    );

  const dirty = savedSettings ? isDirty(settings, savedSettings) : false;

  return (
    <AdminPage>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold text-base">Настройки проекта</h2>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || !dirty}
        >
          {saved ? "Сохранено ✓" : saving ? "Сохранение…" : "Сохранить"}
        </button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex flex-col gap-4">
        {/* General */}
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
            Основное
          </p>
          <div className="card overflow-hidden">
            <InputRow
              label="Название проекта"
              value={settings.project_name}
              onChange={(v) => set("project_name", v)}
              placeholder="DOMIQ"
            />
            <ImagePickerField
              label="Логотип шапки"
              hint="Если не выбран, отображается название проекта"
              value={settings.logo_url}
              onPick={() => setPickerField("logo_url")}
              onClear={() => set("logo_url", null)}
            />
            <ImagePickerField
              label="Favicon"
              hint="Иконка в браузерной вкладке"
              value={settings.favicon_url}
              onPick={() => setPickerField("favicon_url")}
              onClear={() => set("favicon_url", null)}
            />
          </div>
        </div>

        {/* SEO */}
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
            SEO / Meta
          </p>
          <div className="card overflow-hidden">
            <InputRow
              label="Заголовок страницы (title)"
              value={settings.meta_title}
              onChange={(v) => set("meta_title", v)}
              placeholder={settings.project_name}
            />
            <InputRow
              label="Описание (description)"
              value={settings.meta_description}
              onChange={(v) => set("meta_description", v)}
              placeholder="Краткое описание сайта для поисковиков"
              multiline
            />
            <InputRow
              label="Ключевые слова (keywords)"
              value={settings.meta_keywords}
              onChange={(v) => set("meta_keywords", v)}
              placeholder="слово1, слово2, слово3"
            />
            <ImagePickerField
              label="OG Image"
              hint="Превью при шаринге в соцсетях"
              value={settings.og_image_url}
              onPick={() => setPickerField("og_image_url")}
              onClear={() => set("og_image_url", null)}
            />
          </div>
        </div>

        {/* Google preview */}
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
            Предпросмотр (Google)
          </p>
          <SeoPreview
            title={settings.meta_title}
            description={settings.meta_description}
            projectName={settings.project_name}
            faviconUrl={settings.favicon_url}
          />
        </div>

        {/* Social preview */}
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
            Предпросмотр (соцсети)
          </p>
          <SocialPreview
            title={settings.meta_title}
            description={settings.meta_description}
            projectName={settings.project_name}
            ogImageUrl={settings.og_image_url}
          />
        </div>
      </div>

      <ImagePicker
        open={pickerField !== null}
        onClose={() => setPickerField(null)}
        onSelect={handlePickerSelect}
      />
    </AdminPage>
  );
};

export default AdminSettings;
