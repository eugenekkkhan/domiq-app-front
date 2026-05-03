import type { Video } from "../../../types/video";
import { imageUrl, mediaUrl } from "../../../utils/media";
import { secsToMins, convertTimeStampToDate } from "../../../utils/convertTime";
import PlayerModal from "../Modals/PlayerModal/PlayerModal";

const VideoCard = ({ video }: { video: Video }) => {
  const thumbnail = video.thumbnail_image
    ? imageUrl(video.thumbnail_image, "thumbnail")
    : null;
  const videoSrc = mediaUrl(video.bucket, video.object_key);

  return (
    <div className="card flex items-center gap-3 p-3">
      <PlayerModal video={video}>
        <img
          src={thumbnail ?? undefined}
          alt={video.name}
          className="w-40 h-[90px] rounded-lg object-cover bg-gray-900"
        />
      </PlayerModal>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-medium text-sm truncate">{video.name || "Без названия"}</span>
        <span className="text-xs text-gray-400">
          ID: {video.id} · {secsToMins(video.duration_sec)}
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
  );
};

export default VideoCard;
