import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getArticle } from "../queries";
import type { Article } from "../types/Article";
import { convertTimeStampToDate } from "../utils/convertTime";
import PublicLayout from "../components/PublicLayout/PublicLayout";
import MarkdownView from "../components/MarkdownView/MarkdownView";

const ArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getArticle(Number(articleId)).then((r) => r.data as Article),
    enabled: !!articleId,
  });

  return (
    <PublicLayout showBack>
      {isLoading || !article ? (
        <p className="text-sm text-gray-400 text-center py-8">Загрузка…</p>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400 font-medium">
              {convertTimeStampToDate(article.created_at)}
              {article.created_at !== article.updated_at &&
                ` · обновлено ${convertTimeStampToDate(article.updated_at)}`}
            </p>
            <h1 className="text-2xl font-bold leading-tight">{article.title}</h1>
          </div>
          <MarkdownView content={article.content_markdown} />
        </>
      )}
    </PublicLayout>
  );
};

export default ArticlePage;
