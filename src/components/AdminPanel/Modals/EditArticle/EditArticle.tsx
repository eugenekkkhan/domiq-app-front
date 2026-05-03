import { useEffect, useState } from "react";
import { getArticle, getSections, updateArticle } from "../../../../queries";
import type { Article } from "../../../../types/Article";
import type { Section } from "../../../../types/Section";
import CustomMDEditor from "../../../CustomMDEditor/CustomMDEditor";
import CustomModal from "../CustomModal/CustomModal";

export default function EditArticle({
  article,
  onSaved,
}: {
  article: Article;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [form, setForm] = useState({
    title: article.title,
    content: article.content_markdown,
    sectionId: String(article.section_id),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    Promise.all([
      getArticle(article.id),
      getSections(),
    ]).then(([artRes, secRes]) => {
      const a = artRes.data as Article;
      setForm({ title: a.title, content: a.content_markdown, sectionId: String(a.section_id) });
      setSections(secRes.data as Section[]);
    });
  }, [open, article.id]);

  const handleSave = () => {
    setSaving(true);
    updateArticle(article.id, form.title, form.content, Number(form.sectionId))
      .then(() => { setOpen(false); onSaved(); })
      .finally(() => setSaving(false));
  };

  const dirty =
    form.title !== article.title ||
    form.content !== article.content_markdown ||
    form.sectionId !== String(article.section_id);

  return (
    <>
      <button className="btn btn-primary text-xs px-3 py-1.5" onClick={() => setOpen(true)}>
        Изменить
      </button>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-semibold text-base">Редактировать статью</h3>
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
          {dirty && (
            <button
              className="btn btn-secondary"
              onClick={() => setForm({ title: article.title, content: article.content_markdown, sectionId: String(article.section_id) })}
            >
              Сбросить
            </button>
          )}
          <button
            className="btn btn-primary"
            disabled={saving || !dirty || !form.title}
            onClick={handleSave}
          >
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </CustomModal>
    </>
  );
}
