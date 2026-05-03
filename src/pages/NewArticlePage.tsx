import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getNewsItem } from "../queries";
import type { News } from "../types/NewArticle";
import { convertTimeStampToDate } from "../utils/convertTime";
import { imageUrl } from "../utils/media";
import PublicLayout from "../components/PublicLayout/PublicLayout";
import MarkdownView from "../components/MarkdownView/MarkdownView";

const NewArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { data: news, isLoading } = useQuery({
    queryKey: ["news", articleId],
    queryFn: () => getNewsItem(Number(articleId)).then((r) => r.data as News),
    enabled: !!articleId,
  });

  return (
    <PublicLayout showBack>
      {isLoading || !news ? (
        <p className="text-sm text-gray-400 text-center py-8">Загрузка…</p>
      ) : (
        <>
          {news.preview_image && (
            <img
              src={imageUrl(news.preview_image, "large")}
              alt={news.title}
              className="w-full rounded-2xl object-cover max-h-64"
            />
          )}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400 font-medium">
              {convertTimeStampToDate(news.created_at)}
              {news.created_at !== news.updated_at &&
                ` · обновлено ${convertTimeStampToDate(news.updated_at)}`}
            </p>
            <h1 className="text-2xl font-bold leading-tight">{news.title}</h1>
          </div>
          <MarkdownView content={news.content} />
        </>
      )}
    </PublicLayout>
  );
};

export default NewArticlePage;
