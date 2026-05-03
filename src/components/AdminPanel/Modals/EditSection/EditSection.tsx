import { useEffect, useState } from "react";
import { getSections, updateSection } from "../../../../queries";
import type { Section } from "../../../../types/Section";
import CustomModal from "../CustomModal/CustomModal";

export default function EditSection({
  section,
  onSaved,
}: {
  section: Section;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [form, setForm] = useState({
    name: section.name,
    parentId: section.parent_id ? String(section.parent_id) : "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({ name: section.name, parentId: section.parent_id ? String(section.parent_id) : "" });
    getSections().then((res) =>
      setSections((res.data as Section[]).filter((s) => s.id !== section.id))
    );
  }, [open, section]);

  const dirty =
    form.name !== section.name ||
    form.parentId !== (section.parent_id ? String(section.parent_id) : "");

  const handleSave = () => {
    setSaving(true);
    updateSection(section.id, form.name, form.parentId ? Number(form.parentId) : undefined)
      .then(() => { setOpen(false); onSaved(); })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <button className="btn btn-primary text-xs px-3 py-1.5" onClick={() => setOpen(true)}>
        Изменить
      </button>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-semibold text-base">Редактировать раздел</h3>
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
          {dirty && (
            <button
              className="btn btn-secondary"
              onClick={() => setForm({ name: section.name, parentId: section.parent_id ? String(section.parent_id) : "" })}
            >
              Сбросить
            </button>
          )}
          <button
            className="btn btn-primary"
            disabled={saving || !dirty || !form.name}
            onClick={handleSave}
          >
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </CustomModal>
    </>
  );
}
