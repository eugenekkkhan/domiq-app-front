import { useEffect, useState } from "react";
import { createSection, getSections } from "../../../../queries";
import type { Section } from "../../../../types/Section";
import CustomModal from "../CustomModal/CustomModal";

export default function AddSection({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [form, setForm] = useState({ name: "", parentId: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    getSections().then((res) => setSections(res.data as Section[]));
  }, [open]);

  const reset = () => setForm({ name: "", parentId: "" });

  const handleSave = () => {
    if (!form.name) return;
    setSaving(true);
    createSection(form.name, form.parentId ? Number(form.parentId) : undefined)
      .then(() => { reset(); setOpen(false); onSaved(); })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <button className="btn btn-primary shrink-0" onClick={() => setOpen(true)}>
        + Раздел
      </button>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-semibold text-base">Добавить раздел</h3>
        <input
          className="input"
          placeholder="Название раздела"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <select
          className="input"
          value={form.parentId}
          onChange={(e) => setForm({ ...form, parentId: e.target.value })}
        >
          <option value="">— Корневой раздел —</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          {form.name && (
            <button className="btn btn-secondary" onClick={reset}>Очистить</button>
          )}
          <button
            className="btn btn-primary"
            disabled={saving || !form.name}
            onClick={handleSave}
          >
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </CustomModal>
    </>
  );
}
