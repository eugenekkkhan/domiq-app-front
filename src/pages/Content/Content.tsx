import axios from "axios";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "react-router";
import type { ArticleType } from "../../types/Article";
import MainMenu from "../../components/MainMenu/MainMenu";
import { getArticlesByParentId } from "../../queries";
import type { MenuItem } from "../../types/MenuItem";
import style from "../md.module.css";
const Content = () => {
  const [content, setContent] = useState<ArticleType | null>();
  const [articleHeaders, setArticleHeaders] = useState<MenuItem[]>([]);
  const { contentId } = useParams();
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APPLICATION_API_LINK + "public/get_article", {
        params: { id: contentId },
      })
      .then((res) => {
        const data = res.data as ArticleType;
        setContent(data);
        if (data.type === "section") {
          getArticlesByParentId(contentId ?? "").then((res) => {
            setArticleHeaders(res.data as MenuItem[]);
          });
        }
      });
  }, [contentId]);

  return (
    <>
      {content && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h1>{content.header}</h1>
          {content.type === "article" && (
            <div className={style.reactMarkDown}>
              <Markdown
                children={content.content}
                remarkPlugins={[remarkGfm]}
              />
            </div>
          )}
          {/* {JSON.stringify(articleHeaders)} */}
          {content.type === "section" && (
            <MainMenu initialValues={articleHeaders} />
          )}
        </div>
      )}
    </>
  );
};

export default Content;
