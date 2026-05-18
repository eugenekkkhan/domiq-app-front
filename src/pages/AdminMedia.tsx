import { useEffect, useState, useCallback, useRef } from "react";
import { getMedia, uploadImage, renameImage, deleteImage } from "../queries";
import { useUsers } from "../hooks/useUsers";
import type { Image } from "../types/Image";
import { imageUrl } from "../utils/media";
import AdminPage from "./AdminPage";
import AsyncView from "../components/AsyncView/AsyncView";
import SkeletonImg from "../components/SkeletonImg/SkeletonImg";
import { Pencil, Trash2, Check, X, ZoomIn } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import CustomModal from "../components/AdminPanel/Modals/CustomModal/CustomModal";
import { isAdmin, getCurrentUserId } from "../utils/auth";

const ImageCard = ({
  img,
  onRenamed,
  onDeleted,
  onPreview,
  uploaderName,
}: {
  img: Image;
  onRenamed: (id: number, name: string) => void;
  onDeleted: (id: number) => void;
  onPreview: (img: Image) => void;
  uploaderName?: string;
}) => {
  const canMutate = isAdmin() || img.uploader_id === getCurrentUserId();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(img.name);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

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
        addToast("Не удалось переименовать изображение", "error");
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    deleteImage(img.id)
      .then(() => onDeleted(img.id))
      .catch(() => {
        addToast("Не удалось удалить изображение", "error");
      });
    setConfirmDelete(false);
  };

  return (
    <>
      <div className="card overflow-hidden">
        <button
          className="relative block w-full group cursor-zoom-in"
          onClick={() => onPreview(img)}
        >
          <SkeletonImg
            src={imageUrl(img, "medium")}
            alt={img.name}
            className="w-full aspect-video"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <ZoomIn
              size={22}
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
            />
          </div>
        </button>
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
              {canMutate && <button onClick={startEdit} className="text-gray-400 hover:text-primary cursor-pointer shrink-0"><Pencil size={12} /></button>}
              {canMutate && <button onClick={() => setConfirmDelete(true)} className="text-gray-400 hover:text-danger cursor-pointer shrink-0"><Trash2 size={12} /></button>}
            </div>
          )}
          <p className="text-xs text-gray-400">ID: {img.id} · {img.width}×{img.height}{uploaderName ? ` · ${uploaderName}` : ""}</p>
        </div>
      </div>

      <CustomModal open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <h3 className="font-semibold text-base">Удалить изображение?</h3>
        <p className="text-sm text-gray-400">
          «{img.name}» — файлы в хранилище тоже будут удалены.
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setConfirmDelete(false)}
            className="btn btn-secondary"
          >
            Отмена
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            Удалить
          </button>
        </div>
      </CustomModal>
    </>
  );
};

const AdminMedia = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewImg, setPreviewImg] = useState<Image | null>(null);

  const users = useUsers();

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    getMedia("images")
      .then((res) => setImages(res.data as Image[]))
      .catch(() => {
        setImages([]);
        setError("Не удалось загрузить изображения");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!previewImg) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setPreviewImg(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [previewImg]);

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
      <AsyncView loading={loading} error={error} onRetry={load}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              img={img}
              onRenamed={handleRenamed}
              onDeleted={handleDeleted}
              onPreview={setPreviewImg}
              uploaderName={users.get(img.uploader_id)?.nickname}
            />
          ))}
        </div>
        {images.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">Изображения не найдены</p>
        )}
      </AsyncView>

      {previewImg && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <button
            className="absolute top-4 right-4 p-1 text-white/70 hover:text-white cursor-pointer"
            onClick={() => setPreviewImg(null)}
          >
            <X size={24} />
          </button>
          <div
            className="flex flex-col items-center gap-3 max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl(previewImg, "original")}
              alt={previewImg.name}
              className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
            />
            <p className="text-white/80 text-sm">
              {previewImg.name} · {previewImg.width}×{previewImg.height}
            </p>
          </div>
        </div>
      )}
    </AdminPage>
  );
};

export default AdminMedia;
