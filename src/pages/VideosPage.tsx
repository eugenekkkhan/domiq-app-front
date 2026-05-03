import VideoSection from "../components/VideoSection/VideoSection";
import PublicLayout from "../components/PublicLayout/PublicLayout";

const Videos = () => (
  <PublicLayout showBack>
    <h1 className="text-2xl font-bold">Видео</h1>
    <VideoSection />
  </PublicLayout>
);

export default Videos;
