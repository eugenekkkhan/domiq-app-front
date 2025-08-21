import { useEffect, useState } from "react";
import { getAllVideos } from "../../queries";
import type { Video } from "../../types/video";
import VideoSectionElement from "./VideoSectionElement/VideoSectionElement";

const mockData: Video[] = [
  // {
  //   ID: 4,
  //   CreatedAt: "2025-08-04T16:05:37.457251+03:00",
  //   UpdatedAt: "2025-08-04T16:05:37.457251+03:00",
  //   DeletedAt: null,
  //   name: "Гена бубкин сосиска",
  //   source: "/media/data.mp4",
  //   duration: 5.828209,
  //   thumbnail: "/media/thumbnails/data.png",
  // },
  // {
  //   ID: 5,
  //   CreatedAt: "2025-08-09T16:22:17.170356+03:00",
  //   UpdatedAt: "2025-08-09T16:22:17.170356+03:00",
  //   DeletedAt: null,
  //   name: "Vikhorkov mp4",
  //   source: "/media/telegram-cloud-document-2-5228872316351438138.mp4",
  //   duration: 17.50483,
  //   thumbnail:
  //     "/media/thumbnails/telegram-cloud-document-2-5228872316351438138.png",
  // },
];

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>(mockData);
  useEffect(() => {
    getAllVideos().then((res) => {
      setVideos(res.data);
    });
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {videos?.map((element) => (
        <VideoSectionElement key={element.ID} video={element} />
      ))}
    </div>
  );
};

export default VideoSection;
