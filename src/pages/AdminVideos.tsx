import { useEffect, useState, useCallback } from "react";
import { getMedia } from "../queries";
import type { Video } from "../types/video";
import VideoCard from "../components/AdminPanel/VideoCard/VideoCard";
import AddVideo from "../components/AdminPanel/Modals/AddVideo/AddVideo";
import AdminPage from "./AdminPage";

const AdminVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    getMedia("videos").then((res) => setVideos(res.data as Video[]));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = videos
    .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.id - a.id);

  return (
    <AdminPage>
      <div className="flex gap-2 flex-wrap">
        <input
          className="input flex-1 min-w-40"
          placeholder="Поиск по названию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="btn btn-secondary" onClick={() => setSearch("")}>Сброс</button>
        )}
        <AddVideo onSaved={load} />
      </div>
      <p className="text-xs text-gray-400">
        Видео можно только загружать — редактирование и удаление недоступны в текущей версии API.
      </p>
      {filtered.length > 0 ? (
        <div className="card overflow-hidden">
          {filtered.map((video, i) => (
            <VideoCard key={video.id} video={video} isLast={i === filtered.length - 1} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-8">Видео не найдены</p>
      )}
    </AdminPage>
  );
};

export default AdminVideos;
