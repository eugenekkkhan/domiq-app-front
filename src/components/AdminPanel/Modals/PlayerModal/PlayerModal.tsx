import { useState } from "react";
import ReactPlayer from "react-player";
import type { Video } from "../../../../types/video";
import { mediaUrl } from "../../../../utils/media";
import { Play } from "lucide-react";
import CustomModal from "../CustomModal/CustomModal";

export default function PlayerModal({
  children,
  video,
}: {
  children: React.ReactNode;
  video: Video;
}) {
  const [open, setOpen] = useState(false);
  const url = mediaUrl(video.bucket, video.object_key);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="relative cursor-pointer w-40 shrink-0"
      >
        {children}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-1.5">
            <Play size={20} className="text-gray-800" />
          </div>
        </div>
      </div>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-semibold text-sm truncate">{video.name}</h3>
        <ReactPlayer
          src={url}
          width="100%"
          height="auto"
          style={{ borderRadius: 8, background: "#000", aspectRatio: "16/9" }}
          controls
          playing
        />
      </CustomModal>
    </>
  );
}
