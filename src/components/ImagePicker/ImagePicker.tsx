import { useEffect, useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { getMedia } from "../../queries";
import type { Image } from "../../types/Image";
import { imageUrl } from "../../utils/media";
import SkeletonImg from "../SkeletonImg/SkeletonImg";

export const ImagePicker = ({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (img: Image) => void;
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [previewImg, setPreviewImg] = useState<Image | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setError("");
    setPreviewImg(null);
    setLoading(true);
    getMedia("images")
      .then((res) => setImages(res.data as Image[]))
      .catch(() => {
        setImages([]);
        setError("Не удалось загрузить изображения");
      })
      .finally(() => setLoading(false));
    setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewImg) { setPreviewImg(null); }
        else { onClose(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, previewImg, onClose]);

  if (!open) return null;

  const filtered = search
    ? images.filter((img) =>
        img.name.toLowerCase().includes(search.toLowerCase()),
      )
    : images;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-card rounded-outer w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 px-4 py-3 pr-10 border-b border-border shrink-0">
            <p className="font-semibold text-sm flex-1">Выбрать изображение</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-text cursor-pointer transition-colors rounded-inner"
          >
            <X size={16} />
          </button>
          <div className="px-3 pt-3 shrink-0">
            <input
              ref={searchRef}
              className="input w-full"
              placeholder="Поиск по названию…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-8">Загрузка…</p>
            ) : error ? (
              <p className="text-sm text-danger text-center py-8">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                {images.length === 0 ? "Нет изображений" : "Ничего не найдено"}
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {filtered.map((img) => (
                  <div key={img.id} className="relative group rounded-inner overflow-hidden border border-border hover:border-primary transition-colors">
                    <button
                      onClick={() => { onSelect(img); onClose(); }}
                      className="block w-full text-left cursor-pointer"
                    >
                      <SkeletonImg
                        src={imageUrl(img, "thumbnail")}
                        alt={img.name}
                        className="w-full aspect-video object-cover"
                      />
                      <p className="text-xs text-gray-500 truncate px-1.5 py-1">
                        {img.name}
                      </p>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewImg(img); }}
                      className="absolute top-1 right-1 p-0.5 bg-black/50 hover:bg-black/70 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Предпросмотр"
                    >
                      <ZoomIn size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {previewImg && (
        <div
          className="fixed inset-0 bg-black/85 z-60 flex items-center justify-center p-4"
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
            <div className="flex items-center gap-3">
              <p className="text-white/80 text-sm">
                {previewImg.name} · {previewImg.width}×{previewImg.height}
              </p>
              <button
                onClick={() => { onSelect(previewImg); onClose(); }}
                className="btn btn-primary text-sm"
              >
                Выбрать
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
