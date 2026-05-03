import { useEffect, useState, useCallback } from "react";
import { getNews } from "../queries";
import type { News } from "../types/NewArticle";
import NewsCard from "../components/AdminPanel/NewsCard/NewsCard";
import AddNews from "../components/AdminPanel/Modals/AddNews/AddNews";
import AdminPage from "./AdminPage";

const AdminNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    getNews().then((res) => setNews(res.data as News[]));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = news
    .filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.short.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.id - a.id);

  return (
    <AdminPage>
      <div className="flex gap-2 flex-wrap">
        <input
          className="input flex-1 min-w-40"
          placeholder="Поиск по заголовку"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="btn btn-secondary" onClick={() => setSearch("")}>Сброс</button>
        )}
        <AddNews onSaved={load} />
      </div>
      {filtered.length > 0 ? (
        <div className="card overflow-hidden">
          {filtered.map((item, i) => (
            <NewsCard key={item.id} news={item} onDelete={load} isLast={i === filtered.length - 1} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-8">Новости не найдены</p>
      )}
    </AdminPage>
  );
};

export default AdminNews;
