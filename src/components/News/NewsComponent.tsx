import { useRef, useState } from "react";
import { NavLink } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "../../queries";
import type { News } from "../../types/NewArticle";
import { convertTimeStampToDate } from "../../utils/convertTime";
import { imageUrl } from "../../utils/media";
import SkeletonImg from "../SkeletonImg/SkeletonImg";

const stripMarkdown = (text: string) =>
  text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*{1,3}([^*]*)\*{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`[^`]+`/g, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .trim();

const NewsCard = ({ item, fixed }: { item: News; fixed?: boolean }) => (
  <NavLink to={`/news/${item.id}`} className={fixed ? "h-full" : ""}>
    <div
      className={`card flex flex-col gap-1 ${fixed ? "h-full justify-between p-4" : "p-6 hover:shadow-md transition-shadow"}`}
    >
      {item.preview_image && !fixed && (
        <SkeletonImg
          src={imageUrl(item.preview_image, "medium")}
          alt={item.title}
          className="w-full h-28 rounded-inner"
        />
      )}
      <p className="text-xs text-gray-400 font-medium">
        {convertTimeStampToDate(item.created_at)}
      </p>
      <h3 className="font-semibold text-sm leading-snug line-clamp-2">
        {item.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2">{stripMarkdown(item.short)}</p>
    </div>
  </NavLink>
);

const NewsScroll = ({ news }: { news: News[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 4);
  };

  const scrollBy = (dir: 1 | -1) => {
    ref.current?.scrollBy({
      left: dir * (ref.current.offsetWidth / 2 + 6),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={updateArrows}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none"
      >
        {news.map((item) => (
          <div
            key={item.id}
            className="snap-start shrink-0 w-[calc(50%-6px)] h-[120px]"
          >
            <NewsCard item={item} fixed />
          </div>
        ))}
      </div>

      {canLeft && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-7 h-7 rounded-full bg-card shadow-md flex items-center justify-center z-10"
        >
          <ChevronLeft size={16} className="text-text/70" />
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 translate-x-3 w-7 h-7 rounded-full bg-card shadow-md flex items-center justify-center z-10"
        >
          <ChevronRight size={16} className="text-text/70" />
        </button>
      )}
    </div>
  );
};

const NewsComponent = ({
  limit,
  scroll,
}: {
  limit?: number;
  scroll?: boolean;
}) => {
  const { data } = useQuery({
    queryKey: ["news"],
    queryFn: () =>
      getNews().then((r) =>
        (r.data as News[]).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      ),
  });

  const news = data ? (limit ? data.slice(0, limit) : data) : [];

  if (news.length === 0) return null;

  if (scroll) return <NewsScroll news={news} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default NewsComponent;
