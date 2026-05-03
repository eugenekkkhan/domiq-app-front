import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import SkeletonImg from "../SkeletonImg/SkeletonImg";

const MarkdownView = ({ content }: { content: string }) => (
  <div className="prose-md">
    <Markdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ src, alt }) => (
          <SkeletonImg
            src={src}
            alt={alt ?? ""}
            className="w-full rounded-inner"
            style={{ minHeight: 160 }}
          />
        ),
      }}
    >
      {content?.replace(/\\n/gi, "\n")}
    </Markdown>
  </div>
);

export default MarkdownView;
