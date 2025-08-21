import axios from "axios";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router";
import type { ArticleType } from "../types/Article";
import { useBackButton } from "../customHooks/useBackButton";
const Article = () => {
  const [article, setArticle] = useState<ArticleType | null>();
  const { articleId } = useParams();
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APPLICATION_API_LINK + "public/get_article", {
        params: { id: articleId },
      })
      .then((res) => {
        setArticle(res.data);
      });
  }, []);
  useBackButton()
  return (
    <>
      {article && (
        <>
          <h1>{article.header}</h1>
          <Markdown>{article.content}</Markdown>
        </>
      )}
    </>
  );
};

export default Article;
