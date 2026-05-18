import { NavLink } from "react-router";
import type { Video } from "../../../types/video";
import { imageUrl } from "../../../utils/media";
import { secsToMins } from "../../../utils/convertTime";
import { ChevronRight } from "lucide-react";
import SkeletonImg from "../../SkeletonImg/SkeletonImg";

const VideoSectionElement = ({
  video,
  isLast,
}: {
  video: Video;
  isLast: boolean;
}) => (
  <NavLink to={`/video/${video.id}`}>
    <div className="flex items-center gap-3 relative py-2">
      <SkeletonImg
        src={video.thumbnail_image ? imageUrl(video.thumbnail_image, "thumbnail") : undefined}
        alt={video.name}
        className="w-[35%] shrink-0 rounded-inner bg-gray-200"
        style={{ aspectRatio: "16/9" }}
      />
      <div className="flex items-center justify-between flex-1 min-w-0">
        <div className="min-w-0">
          <p className="text-[15px] font-medium leading-snug truncate">
            {video.name
              ? video.name.charAt(0).toUpperCase() + video.name.slice(1)
              : "Без названия"}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            {secsToMins(video.duration_sec)}
            {video.uploader_name && ` · ${video.uploader_name}`}
          </p>
        </div>
        <ChevronRight size={18} className="text-gray-300 shrink-0 ml-2" />
      </div>
      {!isLast && (
        <span
          className="absolute bottom-0 right-0 h-px bg-border"
          style={{ width: "65%" }}
        />
      )}
    </div>
  </NavLink>
);

export default VideoSectionElement;
