import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm({
      name: section.name,
      parentId: section.parent_id ? String(section.parent_id) : "",
    });
    getSections().then((res) =>
      setSections((res.data as Section[]).filter((s) => s.id !== section.id)),
    ).catch(() => {
      setError("Не удалось загрузить разделы");
    });
  }, [open, section]);

  const dirty =
    form.name !== section.name ||
    form.parentId !== (section.parent_id ? String(section.parent_id) : "");

  const handleSave = () => {
    setSaving(true);
    setError("");
    updateSection(
      section.id,
      form.name,
      form.parentId ? Number(form.parentId) : undefined,
    )
      .then(() => {
        setOpen(false);
        onSaved();
      })
      .catch(() => setError("Не удалось сохранить раздел"))
      .finally(() => setSaving(false));
  };

  return (
    <>
      <button
        className="rounded-inner text-gray-400 hover:text-primary transition-colors cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Pencil size={13} />
      </button>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-semibold text-base">Редактировать раздел</h3>
        {error && <p className="text-sm text-danger">{error}</p>}
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
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          {dirty && (
            <button
              className="btn btn-secondary"
              onClick={() =>
                setForm({
                  name: section.name,
                  parentId: section.parent_id ? String(section.parent_id) : "",
                })
              }
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
