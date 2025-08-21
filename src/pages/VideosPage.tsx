import VideoSection from "../components/VideoSection/VideoSection";
import { useBackButton } from "../customHooks/useBackButton";

const Videos = () => {
  useBackButton();
  return <VideoSection />;
};

export default Videos;
