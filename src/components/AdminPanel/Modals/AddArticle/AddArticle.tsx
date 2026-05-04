import { useEffect, useState } from "react";
import { createArticle, getSections } from "../../../../queries";
import type { Section } from "../../../../types/Section";
import CustomMDEditor from "../../../CustomMDEditor/CustomMDEditor";
import CustomModal from "../CustomModal/CustomModal";

export default function AddArticle({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [form, setForm] = useState({ title: "", content: "", sectionId: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    getSections()
      .then((res) => setSections(res.data as Section[]))
      .catch(() => setError("Не удалось загрузить разделы"));
  }, [open]);

  const reset = () => setForm({ title: "", content: "", sectionId: "" });

  const handleSave = () => {
    if (!form.title || !form.sectionId) return;
    setSaving(true);
    setError("");
    createArticle(form.title, form.content, Number(form.sectionId))
      .then(() => { reset(); setOpen(false); onSaved(); })
      .catch(() => setError("Не удалось сохранить статью"))
      .finally(() => setSaving(false));
  };

  return (
    <>
      <button className="btn btn-primary shrink-0" onClick={() => setOpen(true)}>
        + Статья
      </button>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-semibold text-base">Добавить статью</h3>
        {error && <p className="text-sm text-danger">{error}</p>}
        <input
          className="input"
          placeholder="Заголовок"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <select
          className="input"
          value={form.sectionId}
          onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
        >
          <option value="">— Раздел —</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <CustomMDEditor
          value={form.content}
          onChange={(v) => setForm({ ...form, content: v })}
          heightVh={50}
          minHeight={250}
        />
        <div className="flex justify-end gap-2">
          {(form.title || form.content) && (
            <button className="btn btn-secondary" onClick={reset}>Очистить</button>
          )}
          <button
            className="btn btn-primary"
            disabled={saving || !form.title || !form.sectionId}
            onClick={handleSave}
          >
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </CustomModal>
    </>
  );
}
