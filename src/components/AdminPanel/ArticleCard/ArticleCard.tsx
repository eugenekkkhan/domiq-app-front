import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "../../../queries";
import type { Article } from "../../../types/Article";
import EditArticle from "../Modals/EditArticle/EditArticle";

const ArticleCard = ({
  article,
  onDelete,
  isLast,
}: {
  article: Article;
  onDelete: () => void;
  isLast: boolean;
}) => {
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    if (!confirm(`Удалить статью «${article.title}»?`)) return;
    setRemoving(true);
    deleteArticle(article.id)
      .then(onDelete)
      .catch(() => setRemoving(false));
  };

  if (removing) return null;

  return (
    <div
      className={`flex items-center gap-3 p-[var(--spacing-card)] ${!isLast ? "border-b border-border" : ""}`}
    >
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate flex-1 min-w-0">
            {article.title}
          </span>
          <EditArticle article={article} onSaved={onDelete} />
          <button
            className="rounded-inner text-gray-400 hover:text-danger transition-colors cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 size={13} />
          </button>
        </div>
        <span className="text-xs text-gray-400">
          ID: {article.id} · Раздел: {article.section_id}
        </span>
      </div>
    </div>
  );
};

export default ArticleCard;
