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
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { themeParams, miniApp } from "@telegram-apps/sdk";
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
                children={content.content.replace(/\\n/gi, "\n")}
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

                    const onClick: React.MouseEventHandler<
                      HTMLAnchorElement
                    > = (e) => {
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
