import { useEffect, useState, useCallback } from "react";
import { getArticles } from "../queries";
import { useUsers } from "../hooks/useUsers";
import type { Article } from "../types/Article";
import ArticleCard from "../components/AdminPanel/ArticleCard/ArticleCard";
import AddArticle from "../components/AdminPanel/Modals/AddArticle/AddArticle";
import AdminPage from "./AdminPage";
import AsyncView from "../components/AsyncView/AsyncView";

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    getArticles()
      .then((res) => setArticles(res.data as Article[]))
      .catch(() => setError("Не удалось загрузить статьи"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const users = useUsers();

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
      <AsyncView loading={loading} error={error} onRetry={load}>
        {filtered.length > 0 ? (
          <div className="card overflow-hidden">
            {filtered.map((article, i) => (
              <ArticleCard key={article.id} article={article} onDelete={load} isLast={i === filtered.length - 1} authorName={users.get(article.author_id)?.nickname} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">Статьи не найдены</p>
        )}
      </AsyncView>
    </AdminPage>
  );
};

export default AdminArticles;
