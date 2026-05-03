import { useQuery } from "@tanstack/react-query";
import { getMedia } from "../../queries";
import type { Video } from "../../types/video";
import VideoSectionElement from "./VideoSectionElement/VideoSectionElement";
import { PageSpinner } from "../Spinner/Spinner";

const VideoSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: () => getMedia("videos").then((r) => r.data as Video[]),
  });

  if (isLoading) return <PageSpinner />;
  if (!data?.length) return <p className="text-sm text-gray-400 text-center py-12">Видео пока нет</p>;

  return (
    <div className="card px-4 py-2">
      {data.map((video, index) => (
        <VideoSectionElement
          key={video.id}
          video={video}
          isLast={index === data.length - 1}
        />
      ))}
    </div>
  );
};

export default VideoSection;
