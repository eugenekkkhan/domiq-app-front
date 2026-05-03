import { useEffect, useState } from "react";
import { getNewsItem, updateNews, uploadImage } from "../../../../queries";
import type { News } from "../../../../types/NewArticle";
import type { Image } from "../../../../types/Image";
import { imageUrl } from "../../../../utils/media";
import CustomMDEditor from "../../../CustomMDEditor/CustomMDEditor";
import CustomModal from "../CustomModal/CustomModal";

export default function EditNews({ id, onSaved }: { id: number; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [initial, setInitial] = useState({ title: "", content: "" });
  const [previewImage, setPreviewImage] = useState<Image | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    getNewsItem(id).then((res) => {
      const n = res.data as News;
      const f = { title: n.title, content: n.content };
      setForm(f);
      setInitial(f);
      setPreviewImage(n.preview_image ?? null);
    });
  }, [open, id]);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    uploadImage(file)
      .then((res) => setPreviewImage(res.data as Image))
      .finally(() => setUploading(false));
    e.target.value = "";
  };

  const dirty = form.title !== initial.title || form.content !== initial.content;

  const handleSave = () => {
    setSaving(true);
    updateNews(id, form.title, form.content, previewImage?.id)
      .then(() => { setOpen(false); onSaved(); })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <button className="btn btn-primary text-xs px-3 py-1.5" onClick={() => setOpen(true)}>
        Изменить
      </button>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-semibold text-base">Редактировать новость</h3>
        <input
          className="input"
          placeholder="Заголовок"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <CustomMDEditor
          value={form.content}
          onChange={(v) => setForm({ ...form, content: v })}
          heightVh={45}
          minHeight={200}
        />
        <div className="flex items-center gap-3">
          <label className="btn btn-secondary cursor-pointer text-xs">
            {uploading ? "Загрузка…" : previewImage ? "Сменить превью" : "Добавить превью"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
          </label>
          {previewImage && (
            <img
              src={imageUrl(previewImage, "thumbnail")}
              alt="preview"
              className="h-10 rounded-inner object-cover"
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          {dirty && (
            <button className="btn btn-secondary" onClick={() => setForm(initial)}>Сбросить</button>
          )}
          <button
            className="btn btn-primary"
            disabled={saving || !form.title}
            onClick={handleSave}
          >
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </CustomModal>
    </>
  );
}
