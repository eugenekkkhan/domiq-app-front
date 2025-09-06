import { useState } from "react";
import ReactPlayer from "react-player";
import type { Video } from "../../../../types/video";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CustomModal from "../CustomModal/CustomModal";

export default function PlayerModal({
  children,
  video,
}: {
  children: React.ReactNode;
  video: Video;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        onClick={handleOpen}
        style={{
          cursor: "pointer",
          position: "relative",
          width: "160px",
        }}
      >
        {children}
        <PlayArrowIcon
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "rgba(0, 0, 0, 0.5)",
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderRadius: "50%",
            fontSize: "48px",
          }}
        />
      </div>
      <CustomModal open={open} onClose={handleClose}>
        <h3>Плеер</h3>
        <ReactPlayer
          width={"100%"}
          height={"60vh"}
          style={{
            background: "#000000",
            borderRadius: "4px",
          }}
          autoPlay
          src={import.meta.env.VITE_API_LINK + video.source}
          controls
        />
      </CustomModal>
    </>
  );
}
