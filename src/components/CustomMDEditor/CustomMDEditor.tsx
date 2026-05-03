import MDEditor, { getCommands } from "@uiw/react-md-editor";
import { WrapText, Link, Image } from "lucide-react";
import type { ICommand, TextAreaTextApi, TextState } from "@uiw/react-md-editor";
import { uploadImage } from "../../queries";
import { imageUrl } from "../../utils/media";
import { useEffect, useState } from "react";

const insertBrCommand: ICommand = {
  name: "insert-br",
  keyCommand: "insert-br",
  buttonProps: { "aria-label": "Insert <br>" },
  icon: <WrapText size={13} />,
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
  buttonProps: { "aria-label": "Insert empty link" },
  icon: <Link size={13} />,
  execute: (state: TextState, api: TextAreaTextApi) => {
    const selected = state.selectedText || "";
    if (selected) {
      const md = `[${selected}]()`;
      api.replaceSelection(md);
      api.setSelectionRange({
        start: state.selection.start + md.length,
        end: state.selection.start + md.length,
      });
    } else {
      const md = "[]()";
      api.replaceSelection(md);
      api.setSelectionRange({
        start: state.selection.start + 1,
        end: state.selection.start + 1,
      });
    }
  },
};

const insertImageUploadCommand: ICommand = {
  name: "insert-image-upload",
  keyCommand: "insert-image-upload",
  buttonProps: { "aria-label": "Upload image" },
  icon: <Image size={13} />,
  execute: (state: TextState, api: TextAreaTextApi) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const alt = state.selectedText || "image";
      const placeholder = `![${alt}](uploading...)`;
      const start = state.selection.start;
      api.replaceSelection(placeholder);
      try {
        const res = await uploadImage(file);
        const img = res.data;
        const url = imageUrl(img, "original");
        api.setSelectionRange({
          start,
          end: start + placeholder.length,
        });
        api.replaceSelection(`![${alt}](${url})`);
      } catch {
        api.setSelectionRange({ start, end: start + placeholder.length });
        api.replaceSelection("");
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
  height?: number;
  heightVh?: number;
  minHeight?: number;
  maxHeight?: number;
}) => {
  const computeResponsive = () => {
    if (typeof window === "undefined") return 400;
    let h = Math.round((window.innerHeight * (heightVh ?? 60)) / 100);
    if (minHeight !== undefined) h = Math.max(minHeight, h);
    if (maxHeight !== undefined) h = Math.min(maxHeight, h);
    return h;
  };

  const [responsiveHeight, setResponsiveHeight] = useState(computeResponsive);

  useEffect(() => {
    if (height !== undefined) return;
    const onResize = () => setResponsiveHeight(computeResponsive());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, heightVh, minHeight, maxHeight]);

  return (
    <MDEditor
      value={value}
      height={height ?? responsiveHeight}
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
