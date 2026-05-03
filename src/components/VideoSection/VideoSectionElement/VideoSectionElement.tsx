import { NavLink } from "react-router";
import type { Video } from "../../../types/video";
import { imageUrl } from "../../../utils/media";
import { secsToMins } from "../../../utils/convertTime";
import { ChevronRight } from "lucide-react";

const VideoSectionElement = ({ video }: { video: Video }) => {
  const thumbnail = video.thumbnail_image
    ? imageUrl(video.thumbnail_image, "thumbnail")
    : null;

  return (
    <NavLink to={`/video/${video.id}`}>
      <div className="flex items-center gap-3 py-2 relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.name}
            className="w-[35%] rounded-xl object-cover bg-gray-200"
            style={{ aspectRatio: "16/9" }}
          />
        ) : (
          <div
            className="w-[35%] rounded-xl bg-gray-200 shrink-0"
            style={{ aspectRatio: "16/9" }}
          />
        )}
        <div className="flex items-center justify-between flex-1 min-w-0">
          <div className="min-w-0">
            <p className="text-[15px] font-medium leading-snug truncate">
              {video.name
                ? video.name.charAt(0).toUpperCase() + video.name.slice(1)
                : "Без названия"}
            </p>
            <p className="text-sm text-gray-400 mt-0.5">{secsToMins(video.duration_sec)}</p>
          </div>
          <ChevronRight size={18} className="text-gray-300 shrink-0 ml-2" />
        </div>
        <span className="absolute bottom-0 right-0 h-px bg-gray-100" style={{ width: "65%" }} />
      </div>
    </NavLink>
  );
};

export default VideoSectionElement;
