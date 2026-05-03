import { useEffect, useState, useCallback } from "react";
import { getMedia, uploadImage } from "../queries";
import type { Image } from "../types/Image";
import { imageUrl } from "../utils/media";
import AdminPage from "./AdminPage";

const AdminMedia = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    getMedia("images").then((res) => setImages(res.data as Image[]));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    uploadImage(file)
      .then(load)
      .finally(() => setUploading(false));
    e.target.value = "";
  };

  return (
    <AdminPage>
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-base flex-1">Изображения</h2>
        <label className="btn btn-primary cursor-pointer">
          {uploading ? "Загрузка…" : "+ Загрузить"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <div key={img.id} className="card overflow-hidden">
            <img
              src={imageUrl(img, "medium")}
              alt={img.name}
              className="w-full aspect-video object-cover"
            />
            <div className="p-2">
              <p className="text-xs text-gray-700 truncate font-medium">{img.name}</p>
              <p className="text-xs text-gray-400">ID: {img.id} · {img.width}×{img.height}</p>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">Изображения не найдены</p>
      )}
    </AdminPage>
  );
};

export default AdminMedia;
