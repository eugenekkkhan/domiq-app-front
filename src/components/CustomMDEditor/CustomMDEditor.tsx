import MDEditor, { getCommands } from "@uiw/react-md-editor";
import WrapTextIcon from "@mui/icons-material/WrapText";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import type {
  ICommand,
  TextAreaTextApi,
  TextState,
} from "@uiw/react-md-editor";
import { uploadMedia } from "../../queries";
import { useEffect, useState } from "react";

const insertBrCommand: ICommand = {
  name: "insert-br",
  keyCommand: "insert-br",
  buttonProps: { "aria-label": "Insert <br>" },
  icon: <WrapTextIcon sx={{ fontSize: 12 }} />,
  execute: (state: TextState, api: TextAreaTextApi) => {
    const br = "<br />";
    api.replaceSelection(br);
    const pos = state.selection.start + br.length;
    api.setSelectionRange({ start: pos, end: pos });
  },
};

const insertEmptyLinkCommand: ICommand = {
  name: "insert-empty-link",
  keyCommand: "insert-empty-link",
  buttonProps: { "aria-label": "Insert empty link [text]()" },
  icon: <LinkIcon sx={{ fontSize: 12 }} />,
  execute: (state: TextState, api: TextAreaTextApi) => {
    const selected = state.selectedText || "";
    if (selected) {
      const md = `[${selected}]()`;
      api.replaceSelection(md);
      const pos = state.selection.start + md.length;
      api.setSelectionRange({ start: pos, end: pos });
    } else {
      const md = "[]()";
      // place caret inside brackets so user can type link text
      const caretPos = state.selection.start + 1;
      api.replaceSelection(md);
      api.setSelectionRange({ start: caretPos, end: caretPos });
    }
  },
};

const insertImageUploadCommand: ICommand = {
  name: "insert-image-upload",
  keyCommand: "insert-image-upload",
  buttonProps: { "aria-label": "Upload image and insert" },
  icon: <ImageIcon sx={{ fontSize: 12 }} />,
  execute: (state: TextState, api: TextAreaTextApi) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const alt = state.selectedText || "image";
      const beforeUrl = `![${alt}](`;
      const urlPlaceholder = "uploading...";
      const afterUrl = ")";
      const placeholder = `${beforeUrl}${urlPlaceholder}${afterUrl}`;

      const start = state.selection.start;
      api.replaceSelection(placeholder);
      // select just the URL part we will replace later
      api.setSelectionRange({
        start: start + beforeUrl.length,
        end: start + beforeUrl.length + urlPlaceholder.length,
      });

      try {
        const response = await uploadMedia(file);
        const url = `${import.meta.env.VITE_API_LINK}${String(
          response.data
        ).replaceAll(" ", "%20")}`;
        // Replace placeholder URL with real one
        api.replaceSelection(url);
        // Move caret to end of the image markdown
        const endPos = start + beforeUrl.length + url.length + afterUrl.length;
        api.setSelectionRange({ start: endPos, end: endPos });
      } catch (e) {
        // On error, remove placeholder URL
        api.replaceSelection("");
        const endPos = start + beforeUrl.length + afterUrl.length;
        api.setSelectionRange({ start: endPos, end: endPos });
        console.error("Image upload failed", e);
      }
    };
    input.click();
  },
};

const CustomMDEditor = ({
  value,
  onChange,
  height,
  heightVh = 60,
  minHeight,
  maxHeight,
}: {
  value: string;
  onChange: (value: string) => void;
  height?: number; // fixed px height overrides responsive behavior
  heightVh?: number; // responsive height as % of viewport height (vh)
  minHeight?: number; // optional min px height when responsive
  maxHeight?: number; // optional max px height when responsive
}) => {
  const computeResponsive = () => {
    const vh = heightVh ?? 60;
    if (typeof window === "undefined") return 600;
    let h = Math.round((window.innerHeight * vh) / 100);
    if (typeof minHeight === "number") h = Math.max(minHeight, h);
    if (typeof maxHeight === "number") h = Math.min(maxHeight, h);
    return h;
  };

  const [responsiveHeight, setResponsiveHeight] = useState<number>(computeResponsive);

  useEffect(() => {
    if (typeof height === "number") return; // fixed height, no need to listen
    const onResize = () => setResponsiveHeight(computeResponsive());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, heightVh, minHeight, maxHeight]);

  const editorHeight = typeof height === "number" ? height : responsiveHeight;
  return (
    <MDEditor
      value={value}
      height={editorHeight}
      commands={[
        insertBrCommand,
        insertEmptyLinkCommand,
        insertImageUploadCommand,
        { keyCommand: "divider" },
        ...getCommands(),
      ]}
      visibleDragbar
      onChange={(val) => onChange(val ?? "")}
    />
  );
};

export default CustomMDEditor;
