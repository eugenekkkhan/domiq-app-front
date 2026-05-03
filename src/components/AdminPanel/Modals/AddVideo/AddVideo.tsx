import { useState } from "react";
import { uploadVideo } from "../../../../queries";
import CustomModal from "../CustomModal/CustomModal";

export default function AddVideo({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const reset = () => { setName(""); setVideoFile(null); };

  const handleSave = () => {
    if (!videoFile) return;
    setUploading(true);
    uploadVideo(videoFile, name || undefined)
      .then(() => { reset(); setOpen(false); onSaved(); })
      .finally(() => setUploading(false));
  };

  return (
    <>
      <button className="btn btn-primary shrink-0" onClick={() => setOpen(true)}>
        + Видео
      </button>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-semibold text-base">Загрузить видео</h3>
        <input
          className="input"
          placeholder="Название (необязательно)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <label className="block text-xs text-gray-500 mb-1">Файл видео *</label>
          <input
            type="file"
            accept="video/*"
            className="text-sm"
            onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
          />
        </div>
        {videoFile && (
          <p className="text-xs text-gray-500">
            Выбрано: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} МБ)
          </p>
        )}
        <p className="text-xs text-gray-400">
          Миниатюра будет сгенерирована автоматически из первого кадра.
        </p>
        <div className="flex justify-end gap-2">
          {(name || videoFile) && (
            <button className="btn btn-secondary" onClick={reset}>Очистить</button>
          )}
          <button
            className="btn btn-primary"
            disabled={uploading || !videoFile}
            onClick={handleSave}
          >
            {uploading ? "Загружаем…" : "Загрузить"}
          </button>
        </div>
      </CustomModal>
    </>
  );
}
