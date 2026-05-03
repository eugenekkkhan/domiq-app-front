import { useQuery } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import { useParams } from "react-router";
import { getVideo } from "../../queries";
import type { Video } from "../../types/video";
import { mediaUrl } from "../../utils/media";

const PlayerComponent = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { data: video, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideo(Number(videoId)).then((r) => r.data as Video),
    enabled: !!videoId,
  });

  if (isLoading || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-sm">Загрузка…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="p-4 pb-0">
        <p className="text-white font-medium truncate">{video.name}</p>
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
