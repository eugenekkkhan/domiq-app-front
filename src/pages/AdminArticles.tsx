import { useEffect, useState, useCallback } from "react";
import { getArticles } from "../queries";
import type { Article } from "../types/Article";
import ArticleCard from "../components/AdminPanel/ArticleCard/ArticleCard";
import AddArticle from "../components/AdminPanel/Modals/AddArticle/AddArticle";
import AdminPage from "./AdminPage";

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    getArticles().then((res) => setArticles(res.data as Article[]));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = articles
    .filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.id - b.id);

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
        <AddArticle onSaved={load} />
      </div>
      {filtered.map((article) => (
        <ArticleCard key={article.id} article={article} onDelete={load} />
      ))}
      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">Статьи не найдены</p>
      )}
    </AdminPage>
  );
};

export default AdminArticles;
