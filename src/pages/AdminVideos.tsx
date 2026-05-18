import { useEffect, useState, useCallback } from "react";
import { getMedia } from "../queries";
import { useUsers } from "../hooks/useUsers";
import type { Video } from "../types/video";
import VideoCard from "../components/AdminPanel/VideoCard/VideoCard";
import AddVideo from "../components/AdminPanel/Modals/AddVideo/AddVideo";
import AdminPage from "./AdminPage";
import AsyncView from "../components/AsyncView/AsyncView";

const AdminVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const users = useUsers();

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    getMedia("videos")
      .then((res) => setVideos(res.data as Video[]))
      .catch(() => setError("Не удалось загрузить видео"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = videos
    .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.id - a.id);

  const handleRenamed = (id: number, name: string) =>
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, name } : v)));

  const handleDeleted = (id: number) =>
    setVideos((prev) => prev.filter((v) => v.id !== id));

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
      <AsyncView loading={loading} error={error} onRetry={load}>
        {filtered.length > 0 ? (
          <div className="card overflow-hidden">
            {filtered.map((video, i) => (
              <VideoCard
                key={video.id}
                video={video}
                isLast={i === filtered.length - 1}
                onRenamed={handleRenamed}
                onDeleted={handleDeleted}
                uploaderName={users.get(video.uploader_id)?.nickname}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">Видео не найдены</p>
        )}
      </AsyncView>
    </AdminPage>
  );
};

export default AdminVideos;
