import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import type { Video } from "../../../types/video";
import { deleteVideo, getThumbnailFromVideo } from "../../../queries";
import {
  convertTimeStampToDateWithTime,
  secsToMins,
} from "../../../utils/convertTime";
import EditVideo from "../Modals/EditVideo/EditVideo";
import PlayerModal from "../Modals/PlayerModal/PlayerModal";

const VideoCard = ({ video }: { video: Video }) => {
  const [isRemoved, setIsRemoved] = useState(false);

  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    getThumbnailFromVideo(video.thumbnail).then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const imageUrl = URL.createObjectURL(blob);
      setThumbnail(imageUrl);
    });
  }, []);

  return (
    <div
      style={{
        display: isRemoved ? "none" : "flex",
        width: "calc(100% - 24px)",
        border: "1px solid #ccc",
        borderRadius: "16px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        style={{
          gap: "8px",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} gap={"8px"}>
          <PlayerModal video={video}>
            <img
              style={{
                borderRadius: "4px",
                width: "160px",
                height: "90px",
                background: "black",
                objectFit: "cover",
              }}
              src={thumbnail || undefined}
              alt={video.name}
            />
          </PlayerModal>
          <Stack
            direction={"column"}
            justifyContent={"center"}
            style={{ gap: "4px" }}
          >
            <p>{video.name}</p>
            <Stack
              direction={{ xs: "column", md: "row" }}
              style={{ gap: "4px" }}
            >
              <p style={{ fontSize: "0.8em" }}>
                <b>ID:</b>
                {video.ID}
              </p>
              <p style={{ fontSize: "0.8em" }}>
                <b>Длительность: </b>
                {secsToMins(video.duration)}
              </p>
            </Stack>
            <Stack direction={"column"}>
              <p style={{ fontSize: "0.8em" }}>
                <b>Дата создания: </b>
                {video.CreatedAt &&
                  convertTimeStampToDateWithTime(video.CreatedAt)}
              </p>
              {video.CreatedAt !== video.UpdatedAt && (
                <p style={{ fontSize: "0.8em" }}>
                  <b>Последнее обновление: </b>
                  {video.UpdatedAt &&
                    convertTimeStampToDateWithTime(video.UpdatedAt)}
                </p>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: "column", md: "row" }}
        width={{ xs: "160px", md: "360px" }}
        minWidth={{ xs: "100px", md: "auto" }}
        padding={{ xs: "0", md: "12px" }}
        style={{
          gap: "12px",
        }}
      >
        <EditVideo video={video} />
        <Button
          variant="outlined"
          fullWidth
          sx={{ minWidth: "50%" }}
          onClick={() => {
            deleteVideo(video.ID.toString()).then(() => setIsRemoved(true));
          }}
        >
          удалить
        </Button>
      </Stack>
    </div>
  );
};

export default VideoCard;
