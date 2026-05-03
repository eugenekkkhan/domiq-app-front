import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

const MarkdownView = ({ content }: { content: string }) => (
  <div className="prose-md">
    <Markdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
    >
      {content?.replace(/\\n/gi, "\n")}
    </Markdown>
  </div>
);

export default MarkdownView;
