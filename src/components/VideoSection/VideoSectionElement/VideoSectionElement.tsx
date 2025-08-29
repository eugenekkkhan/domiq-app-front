import { useEffect, useState } from "react";
import type { Video } from "../../../types/video";
import { themeParams } from "@telegram-apps/sdk";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { NavLink } from "react-router";
import { getThumbnailFromVideo } from "../../../queries";
import { secsToMins } from "../../../utils/convertTime";

const VideoSectionElement = ({ video }: { video: Video }) => {
  // const [fetchedVideo, setFetchedVideo] = useState<string | null>(null);
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
    <NavLink to={`${video.source.replace("media", "video")}`}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          alignItems: "center",
          position: "relative",
          paddingBottom: "12px",
        }}
      >
        {thumbnail && (
          <img
            style={{
              width: "35%",
              height: "100%",
              borderRadius: "12px",
              aspectRatio: "16 / 9",
              objectFit: "cover",
              backgroundColor: themeParams.sectionBackgroundColor(),
            }}
            src={thumbnail}
            alt=""
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ position: "relative" }}>
            <div>
              {video.name
                ? video.name.slice(0, 1).toUpperCase() + video.name.slice(1)
                : "Без названия"}
            </div>
            <div style={{ color: themeParams.subtitleTextColor() }}>
              {secsToMins(video.duration)}
            </div>
          </div>
          <KeyboardArrowRightRoundedIcon
            style={{ color: themeParams.sectionSeparatorColor() }}
          />
        </div>
        <span
          style={{
            width: "calc(65% - 12px)",
            height: "0.33px",
            position: "absolute",
            bottom: "0",
            right: "0",
            backgroundColor: themeParams.sectionSeparatorColor(),
          }}
        ></span>
      </div>
    </NavLink>
  );
};

export default VideoSectionElement;
