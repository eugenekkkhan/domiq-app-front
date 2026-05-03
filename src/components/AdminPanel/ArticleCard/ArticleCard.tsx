import { useState } from "react";
import { deleteArticle } from "../../../queries";
import type { Article } from "../../../types/Article";
import EditArticle from "../Modals/EditArticle/EditArticle";

const ArticleCard = ({
  article,
  onDelete,
}: {
  article: Article;
  onDelete: () => void;
}) => {
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    if (!confirm(`Удалить статью «${article.title}»?`)) return;
    setRemoving(true);
    deleteArticle(article.id).then(onDelete).catch(() => setRemoving(false));
  };

  if (removing) return null;

  return (
    <div className="card flex items-center justify-between p-3 gap-3">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium text-sm truncate">{article.title}</span>
        <span className="text-xs text-gray-400">
          ID: {article.id} · Раздел: {article.section_id}
        </span>
      </div>
      <div className="flex gap-2 shrink-0">
        <EditArticle article={article} onSaved={onDelete} />
        <button className="btn btn-danger text-xs px-3 py-1.5" onClick={handleDelete}>
          Удалить
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
