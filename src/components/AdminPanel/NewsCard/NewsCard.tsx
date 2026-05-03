import { useState } from "react";
import { deleteNews } from "../../../queries";
import type { News } from "../../../types/NewArticle";
import { convertTimeStampToDate } from "../../../utils/convertTime";
import EditNews from "../Modals/EditNews/EditNews";

const NewsCard = ({ news, onDelete, isLast }: { news: News; onDelete: () => void; isLast: boolean }) => {
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    if (!confirm(`Удалить новость «${news.title}»?`)) return;
    setRemoving(true);
    deleteNews(news.id).then(onDelete).catch(() => setRemoving(false));
  };

  if (removing) return null;

  return (
    <div className={`flex items-start justify-between p-[var(--spacing-card)] gap-3 ${!isLast ? "border-b border-gray-100" : ""}`}>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-medium text-sm truncate">{news.title}</span>
        <span className="text-xs text-gray-400 line-clamp-2">{news.short}</span>
        <span className="text-xs text-gray-400">
          ID: {news.id} · {convertTimeStampToDate(news.created_at)}
        </span>
      </div>
      <div className="flex gap-2 shrink-0">
        <EditNews id={news.id} onSaved={onDelete} />
        <button className="btn btn-danger text-xs px-3 py-1.5" onClick={handleDelete}>
          Удалить
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
