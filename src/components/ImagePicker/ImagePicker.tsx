import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
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
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setError("");
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

  if (!open) return null;

  const filtered = search
    ? images.filter((img) =>
        img.name.toLowerCase().includes(search.toLowerCase()),
      )
    : images;

  return (
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
                <button
                  key={img.id}
                  onClick={() => {
                    onSelect(img);
                    onClose();
                  }}
                  className="rounded-inner overflow-hidden border border-border hover:border-primary transition-colors cursor-pointer text-left"
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
