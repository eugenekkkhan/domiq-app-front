import { useEffect, useState, useCallback, useRef } from "react";
import { getMedia, uploadImage, renameImage, deleteImage } from "../queries";
import type { Image } from "../types/Image";
import { imageUrl } from "../utils/media";
import AdminPage from "./AdminPage";
import SkeletonImg from "../components/SkeletonImg/SkeletonImg";
import { Pencil, Trash2, Check, X } from "lucide-react";

const ImageCard = ({
  img,
  onRenamed,
  onDeleted,
}: {
  img: Image;
  onRenamed: (id: number, name: string) => void;
  onDeleted: (id: number) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(img.name);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setName(img.name);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const cancelEdit = () => {
    setEditing(false);
    setName(img.name);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === img.name) { cancelEdit(); return; }
    setSaving(true);
    renameImage(img.id, trimmed)
      .then(() => { onRenamed(img.id, trimmed); setEditing(false); })
      .catch(() => {
        window.alert("Не удалось переименовать изображение");
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    if (!window.confirm(`Удалить «${img.name}»? Файлы в хранилище тоже будут удалены.`)) return;
    deleteImage(img.id)
      .then(() => onDeleted(img.id))
      .catch(() => {
        window.alert("Не удалось удалить изображение");
      });
  };

  return (
    <div className="card overflow-hidden">
      <SkeletonImg
        src={imageUrl(img, "medium")}
        alt={img.name}
        className="w-full aspect-video"
      />
      <div className="p-3">
        {editing ? (
          <div className="flex items-center gap-1 mb-0.5">
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") cancelEdit(); }}
              className="text-xs font-medium flex-1 min-w-0 outline-none border-b border-primary bg-transparent"
              disabled={saving}
            />
            <button onClick={handleSave} disabled={saving} className="text-primary cursor-pointer shrink-0"><Check size={13} /></button>
            <button onClick={cancelEdit} className="text-gray-400 cursor-pointer shrink-0"><X size={13} /></button>
          </div>
        ) : (
          <div className="flex items-center gap-1 mb-0.5">
            <p className="text-xs text-text truncate font-medium flex-1 min-w-0">{img.name}</p>
            <button onClick={startEdit} className="text-gray-400 hover:text-primary cursor-pointer shrink-0"><Pencil size={12} /></button>
            <button onClick={handleDelete} className="text-gray-400 hover:text-danger cursor-pointer shrink-0"><Trash2 size={12} /></button>
          </div>
        )}
        <p className="text-xs text-gray-400">ID: {img.id} · {img.width}×{img.height}</p>
      </div>
    </div>
  );
};

const AdminMedia = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setError("");
    getMedia("images")
      .then((res) => setImages(res.data as Image[]))
      .catch(() => {
        setImages([]);
        setError("Не удалось загрузить изображения");
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    uploadImage(file)
      .then(load)
      .catch(() => setError("Не удалось загрузить изображение"))
      .finally(() => setUploading(false));
    e.target.value = "";
  };

  const handleRenamed = (id: number, name: string) =>
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, name } : img)));

  const handleDeleted = (id: number) =>
    setImages((prev) => prev.filter((img) => img.id !== id));

  return (
    <AdminPage>
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-base flex-1">Изображения</h2>
        <label className="btn btn-primary cursor-pointer">
          {uploading ? "Загрузка…" : "+ Загрузить"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <ImageCard
            key={img.id}
            img={img}
            onRenamed={handleRenamed}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
      {images.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">Изображения не найдены</p>
      )}
    </AdminPage>
  );
};

export default AdminMedia;
