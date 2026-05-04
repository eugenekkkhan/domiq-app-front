import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import SkeletonImg from "../SkeletonImg/SkeletonImg";
import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ComponentProps } from "react";

const CodeBlock = ({ children }: ComponentProps<"pre">) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const fallback = (text: string, onSuccess: () => void) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { if (document.execCommand("copy")) onSuccess(); } finally { document.body.removeChild(ta); }
  };

  const handleCopy = () => {
    const text = preRef.current?.querySelector("code")?.textContent ?? "";
    if (!text) return;

    const confirm = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(confirm).catch(() => fallback(text, confirm));
    } else {
      fallback(text, confirm);
    }
  };

  return (
    <div className="prose-code-block">
      <pre ref={preRef}>{children}</pre>
      <button
        className="prose-copy-btn"
        onClick={handleCopy}
        title={copied ? "Скопировано!" : "Копировать"}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  );
};

const MarkdownView = ({ content }: { content: string }) => (
  <div className="prose-md">
    <Markdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
      components={{
        pre: CodeBlock,
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
