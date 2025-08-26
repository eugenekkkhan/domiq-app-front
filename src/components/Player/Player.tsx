import ReactPlayer from "react-player";
import { useParams } from "react-router";

const PlayerComponent = () => {
  const videoLink = useParams().videoLink;
  return (
    <ReactPlayer
      style={{
        margin: "-20px",
        height: "100vh",
        width: "100vw",
        background: "#000000",
      }}
      src={import.meta.env.VITE_MEDIA_API_LINK + videoLink}
      controls
    />
  );
};

export default PlayerComponent;
