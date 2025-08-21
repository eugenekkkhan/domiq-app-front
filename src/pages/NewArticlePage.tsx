import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { NewArticle } from "../types/NewArticle";
import { convertTimeStampToDate } from "../utils/convertTime";
import { themeParams } from "@telegram-apps/sdk";
import { useBackButton } from "../customHooks/useBackButton";
// {
//     "ID": 1,
//     "CreatedAt": "2025-08-15T12:42:00.643939+03:00",
//     "UpdatedAt": "2025-08-15T12:42:00.643939+03:00",
//     "DeletedAt": null,
//     "content": "Hello World",
//     "short": "Hello World"
// }

const NewArticlePage = () => {
  const [article, setArticle] = useState<NewArticle>();
  const { articleId } = useParams();
  useBackButton();
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APPLICATION_API_LINK + "public/news/get", {
        params: { id: articleId },
      })
      .then((res) => {
        setArticle(res.data as NewArticle);
      });
  }, []);
  return (
    <>
      <div style={{ paddingBottom: "16px" }}>
        {article && (
          <p
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              color: themeParams.sectionHeaderTextColor(),
            }}
          >
            Создано: {convertTimeStampToDate(article.CreatedAt)}
          </p>
        )}
        {article && article?.CreatedAt !== article?.UpdatedAt && (
          <p
            style={{
              fontWeight: "bold",
              fontSize: "13px",
              color: themeParams.sectionHeaderTextColor(),
            }}
          >
            Обновлено: {convertTimeStampToDate(article?.UpdatedAt)}
          </p>
        )}
      </div>
      <div>
        <p>{article?.content}</p>
      </div>
    </>
  );
};

export default NewArticlePage;
