import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteNews } from "../../../queries";
import type { News } from "../../../types/NewArticle";
import { convertTimeStampToDate } from "../../../utils/convertTime";
import EditNews from "../Modals/EditNews/EditNews";
import { isAdmin, getCurrentUserId } from "../../../utils/auth";

const NewsCard = ({
  news,
  onDelete,
  isLast,
  authorName,
}: {
  news: News;
  onDelete: () => void;
  isLast: boolean;
  authorName?: string;
}) => {
  const [removing, setRemoving] = useState(false);
  const canMutate = isAdmin() || news.author_id === getCurrentUserId();

  const handleDelete = () => {
    if (!confirm(`Удалить новость «${news.title}»?`)) return;
    setRemoving(true);
    deleteNews(news.id)
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
            {news.title}
          </span>
          {canMutate && <EditNews id={news.id} onSaved={onDelete} />}
          {canMutate && (
            <button
              className="rounded-inner text-gray-400 hover:text-danger transition-colors cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
        <span className="text-xs text-gray-400 truncate">{news.short}</span>
        <span className="text-xs text-gray-400">
          ID: {news.id} · {convertTimeStampToDate(news.created_at)}{authorName ? ` · ${authorName}` : ""}
        </span>
      </div>
    </div>
  );
};

export default NewsCard;
