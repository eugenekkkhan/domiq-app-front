import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { getNewsItem, updateNews } from "../../../../queries";
import type { News } from "../../../../types/NewArticle";
import type { Image } from "../../../../types/Image";
import { imageUrl } from "../../../../utils/media";
import { ImagePicker } from "../../../ImagePicker/ImagePicker";
import CustomMDEditor from "../../../CustomMDEditor/CustomMDEditor";
import CustomModal from "../CustomModal/CustomModal";

export default function EditNews({
  id,
  onSaved,
}: {
  id: number;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [initial, setInitial] = useState({ title: "", content: "" });
  const [previewImage, setPreviewImage] = useState<Image | null>(null);
  const [initialPreviewId, setInitialPreviewId] = useState<number | undefined>(undefined);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    getNewsItem(id).then((res) => {
      const n = res.data as News;
      const f = { title: n.title, content: n.content };
      setForm(f);
      setInitial(f);
      setPreviewImage(n.preview_image ?? null);
      setInitialPreviewId(n.preview_image_id);
    }).catch(() => {
      setError("Не удалось загрузить новость");
    });
  }, [open, id]);

  const dirty =
    form.title !== initial.title ||
    form.content !== initial.content ||
    previewImage?.id !== initialPreviewId;

  const handleSave = () => {
    setSaving(true);
    setError("");
    updateNews(id, form.title, form.content, previewImage?.id)
      .then(() => {
        setOpen(false);
        onSaved();
      })
      .catch(() => setError("Не удалось сохранить новость"))
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
        <h3 className="font-semibold text-base">Редактировать новость</h3>
        {error && <p className="text-sm text-danger">{error}</p>}
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
          <button
            className="btn btn-secondary text-xs"
            onClick={() => setPickerOpen(true)}
          >
            {previewImage ? "Сменить превью" : "Добавить превью"}
          </button>
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
            <button
              className="btn btn-secondary"
              onClick={() => setForm(initial)}
            >
              Сбросить
            </button>
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
      <ImagePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(img) => setPreviewImage(img)}
      />
    </>
  );
}
