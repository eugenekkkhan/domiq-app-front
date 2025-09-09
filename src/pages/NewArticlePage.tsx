import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { NewArticle } from "../types/NewArticle";
import { convertTimeStampToDate } from "../utils/convertTime";
import { themeParams, miniApp } from "@telegram-apps/sdk";
import style from "./md.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
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
        <div className={style.reactMarkDown}>
          <Markdown
            children={article?.content?.replace(/\\n/gi, "\n")}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              a: (props) => {
                const href =
                  typeof props.href === "string" ? props.href.trim() : "";
                const isEmpty =
                  !href || href === "#" || href === "javascript:void(0)";

                if (isEmpty) {
                  // Render a non-interactive element for empty links
                  return (
                    <span
                      style={{
                        color: themeParams.linkColor(),
                        textDecoration: "underline",
                        cursor: "default",
                      }}
                    >
                      {props.children}
                    </span>
                  );
                }

                const onClick: React.MouseEventHandler<HTMLAnchorElement> = (
                  e
                ) => {
                  e.preventDefault();
                  try {
                    if ((miniApp as any).openLink?.isAvailable?.()) {
                      (miniApp as any).openLink(href);
                    } else if ((window as any).Telegram?.WebApp?.openLink) {
                      (window as any).Telegram.WebApp.openLink(href);
                    } else {
                      window.open(href, "_blank", "noopener,noreferrer");
                    }
                  } catch {
                    window.open(href, "_blank", "noopener,noreferrer");
                  }
                };

                return (
                  <a
                    {...props}
                    href={href}
                    onClick={onClick}
                    style={{ color: themeParams.linkColor() }}
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                  />
                );
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default NewArticlePage;
