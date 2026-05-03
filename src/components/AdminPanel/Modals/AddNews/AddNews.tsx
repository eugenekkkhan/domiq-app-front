import { useState } from "react";
import { createNews, uploadImage } from "../../../../queries";
import { imageUrl } from "../../../../utils/media";
import type { Image } from "../../../../types/Image";
import CustomMDEditor from "../../../CustomMDEditor/CustomMDEditor";
import CustomModal from "../CustomModal/CustomModal";

export default function AddNews({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [previewImage, setPreviewImage] = useState<Image | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const reset = () => { setForm({ title: "", content: "" }); setPreviewImage(null); };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    uploadImage(file)
      .then((res) => setPreviewImage(res.data as Image))
      .finally(() => setUploading(false));
    e.target.value = "";
  };

  const handleSave = () => {
    if (!form.title) return;
    setSaving(true);
    createNews(form.title, form.content, previewImage?.id)
      .then(() => { reset(); setOpen(false); onSaved(); })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <button className="btn btn-primary shrink-0" onClick={() => setOpen(true)}>
        + Новость
      </button>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-semibold text-base">Добавить новость</h3>
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
              className="h-10 rounded-lg object-cover"
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          {(form.title || form.content) && (
            <button className="btn btn-secondary" onClick={reset}>Очистить</button>
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
