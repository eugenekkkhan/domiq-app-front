import { useRef, useState } from "react";
import type { Video } from "../../../types/video";
import { isAdmin, getCurrentUserId } from "../../../utils/auth";
import { imageUrl, mediaUrl } from "../../../utils/media";
import { secsToMins, convertTimeStampToDate } from "../../../utils/convertTime";
import PlayerModal from "../Modals/PlayerModal/PlayerModal";
import SkeletonImg from "../../SkeletonImg/SkeletonImg";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { renameVideo, deleteVideo } from "../../../queries";
import { useToast } from "../../../contexts/ToastContext";
import CustomModal from "../Modals/CustomModal/CustomModal";

const VideoCard = ({
  video,
  isLast,
  onRenamed,
  onDeleted,
  uploaderName,
}: {
  video: Video;
  isLast: boolean;
  onRenamed?: (id: number, name: string) => void;
  onDeleted?: (id: number) => void;
  uploaderName?: string;
}) => {
  const videoSrc = mediaUrl(video.bucket, video.object_key);
  const canMutate = isAdmin() || video.uploader_id === getCurrentUserId();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(video.name);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const startEdit = () => {
    setName(video.name);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const cancelEdit = () => {
    setEditing(false);
    setName(video.name);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === video.name) {
      cancelEdit();
      return;
    }
    setSaving(true);
    renameVideo(video.id, trimmed)
      .then(() => {
        onRenamed?.(video.id, trimmed);
        setEditing(false);
      })
      .catch(() => {
        addToast("Не удалось переименовать видео", "error");
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    deleteVideo(video.id)
      .then(() => onDeleted?.(video.id))
      .catch(() => {
        addToast("Не удалось удалить видео", "error");
      });
    setConfirmDelete(false);
  };

  return (
    <>
      <div
        className={`flex items-center gap-3 p-[var(--spacing-card)] ${!isLast ? "border-b border-border" : ""}`}
      >
        <PlayerModal video={video}>
          <SkeletonImg
            src={
              video.thumbnail_image
                ? imageUrl(video.thumbnail_image, "thumbnail")
                : undefined
            }
            alt={video.name}
            className="w-40 h-[90px] rounded-inner bg-gray-900 shrink-0"
          />
        </PlayerModal>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") cancelEdit();
                }}
                className="font-medium text-sm flex-1 min-w-0 outline-none border-b border-primary bg-transparent"
                disabled={saving}
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-primary cursor-pointer shrink-0"
              >
                <Check size={14} />
              </button>
              <button
                onClick={cancelEdit}
                className="text-gray-400 cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm truncate flex-1 min-w-0">
                {video.name || "Без названия"}
              </span>
              {onRenamed && canMutate && (
                <button
                  onClick={startEdit}
                  className="text-gray-400 hover:text-primary cursor-pointer shrink-0"
                >
                  <Pencil size={13} />
                </button>
              )}
              {onDeleted && canMutate && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-gray-400 hover:text-danger cursor-pointer shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}
          <span className="text-xs text-gray-400">
            ID: {video.id} · {secsToMins(video.duration_sec)}{uploaderName ? ` · ${uploaderName}` : ""}
          </span>
          <span className="text-xs text-gray-400">
            {convertTimeStampToDate(video.created_at)}
          </span>
          <a
            href={videoSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline truncate"
          >
            Ссылка на видео
          </a>
        </div>
      </div>

      <CustomModal open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <h3 className="font-semibold text-base">Удалить видео?</h3>
        <p className="text-sm text-gray-400">
          «{video.name}» — файл в хранилище тоже будет удалён.
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

export default VideoCard;
