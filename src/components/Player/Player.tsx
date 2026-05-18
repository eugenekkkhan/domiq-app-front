import { useQuery } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getVideo } from "../../queries";
import type { Video } from "../../types/video";
import { mediaUrl } from "../../utils/media";
import Spinner from "../Spinner/Spinner";

const PlayerComponent = () => {
  const navigate = useNavigate();
  const { videoId } = useParams<{ videoId: string }>();
  const { data: video, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideo(Number(videoId)).then((r) => r.data as Video),
    enabled: !!videoId,
  });

  if (isLoading || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size={36} white />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="p-4 pb-0 flex items-center gap-3 justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white text-sm font-medium cursor-pointer"
        >
          <ArrowLeft size={16} />
          Назад
        </button>
        <div className="flex flex-col items-end flex-1 min-w-0">
          <p className="text-white font-medium truncate w-full text-right">
            {video.name}
          </p>
          {video.uploader_name && (
            <p className="text-white/50 text-xs truncate">{video.uploader_name}</p>
          )}
        </div>
      </div>
      <div className="flex-1 flex items-center">
        <ReactPlayer
          src={mediaUrl(video.bucket, video.object_key)}
          width="100%"
          height="auto"
          style={{ aspectRatio: "16/9" }}
          controls
          playing
        />
      </div>
    </div>
  );
};

export default PlayerComponent;
