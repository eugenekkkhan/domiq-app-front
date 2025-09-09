import { initData, themeParams, miniApp } from "@telegram-apps/sdk";
import { useEffect, useRef, useState } from "react";
import Slider, { type Settings } from "react-slick";
import type { default as SlickSlider } from "react-slick";
import "./News.css";
import { convertTimeStampToDate } from "../../utils/convertTime";
import { NavLink } from "react-router";
import { getAllNews } from "../../queries";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

const Card = ({
  text,
  id,
  date = "",
}: {
  text: string;
  id: number;
  date?: string;
}) => {
  return (
    <NavLink to={"news/" + id}>
      <div
        style={{
          borderRadius: "26px",
          padding: "24px",
          height: "calc(136px - 48px)",
          width: "calc(100% - 48px - 48px)",
          margin: "0 24px",
          background: themeParams.sectionBackgroundColor(),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            fontSize: "13px",
            color: themeParams.sectionHeaderTextColor(),
          }}
        >
          {date && convertTimeStampToDate(date)}
        </p>
        <div style={{ color: themeParams.textColor() }}>
          <Markdown
            children={text?.replace(/\\n/gi, "\n")}
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
    </NavLink>
  );
};

type NewsItem = {
  short: string;
  CreatedAt?: string;
  ID: number;
};

const NewsComponent = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [uniqueItems, setUniqueItems] = useState<NewsItem[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef<SlickSlider | null>(null);

  useEffect(() => {
    getAllNews(initData.user()?.id.toString()).then((res) => {
      const incoming = (res.data as NewsItem[]) || [];
      const normalized = incoming.slice().reverse(); // avoid mutating res.data
      setUniqueItems(normalized);

      let list = normalized;
      if (normalized.length > 0 && normalized.length <= 3) {
        const minSlidesForInfinite = 4; // must be > slidesToShow (3)
        const repeats = Math.ceil(minSlidesForInfinite / normalized.length);
        list = Array.from({ length: repeats }).flatMap(() => normalized);
      }
      setNewsData(list);
    });
  }, []);

  const settings: Settings = {
    dots: uniqueItems.length > 3, // use slick dots only when >3 unique items
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    autoplaySpeed: 2000,
    touchThreshold: 1000,
    customPaging: (i: number) => {
      return (
        <div
          style={{
            marginTop: "8px",
            width: "8px",
            height: "8px",
            borderRadius: "100%",
            backgroundColor:
              i !== currentSlideIndex
                ? themeParams.sectionSeparatorColor()
                : themeParams.textColor(),
          }}
        ></div>
      );
    },
    afterChange: (newIndex) => setCurrentSlideIndex(newIndex),
  };

  // Map current slick index to logical unique item index (by ID)
  const activeLogicalIndex = (() => {
    const current = newsData[currentSlideIndex];
    if (!current) return 0;
    const idx = uniqueItems.findIndex((u) => u.ID === current.ID);
    return idx >= 0 ? idx : 0;
  })();

  return (
    <div
      style={{
        position: "relative",
        height: "160px",
        width: "100%",
        // display: newsData.length === 0 ? "none" : "block",
      }}
    >
      <div
        style={{
          width: "calc(300vw - 8px)",
          left: "50%",
          right: "0",
          marginLeft: "calc(-150vw + 4px)",
          position: "absolute",
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {newsData.map((item, index) => (
            <div key={`${item.ID}-${index}`}>
              <Card
                date={item.CreatedAt}
                text={
                  item.short.length === 50 ? item.short + "..." : item.short
                }
                id={item.ID}
              />
            </div>
          ))}
        </Slider>

        {(uniqueItems.length === 2 || uniqueItems.length === 3) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            {uniqueItems.map((it, i) => (
              <div
                key={`dot-${it.ID}-${i}`}
                onClick={() => {
                  const targetIndex = newsData.findIndex((n) => n.ID === it.ID);
                  if (targetIndex >= 0) {
                    sliderRef.current?.slickGoTo(targetIndex);
                  }
                }}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "100%",
                  backgroundColor:
                    i === activeLogicalIndex
                      ? themeParams.textColor()
                      : themeParams.sectionSeparatorColor(),
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsComponent;
