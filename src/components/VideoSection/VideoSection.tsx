import { useQuery } from "@tanstack/react-query";
import { getMedia } from "../../queries";
import type { Video } from "../../types/video";
import VideoSectionElement from "./VideoSectionElement/VideoSectionElement";

const VideoSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: () => getMedia("videos").then((r) => r.data as Video[]),
  });

  if (isLoading) return <p className="text-sm text-gray-400 text-center py-12">Загрузка…</p>;
  if (!data?.length) return <p className="text-sm text-gray-400 text-center py-12">Видео пока нет</p>;

  return (
    <div className="card px-4 py-2">
      {data.map((video) => (
        <VideoSectionElement key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoSection;
