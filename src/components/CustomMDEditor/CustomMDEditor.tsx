import MDEditor, { getCommands } from "@uiw/react-md-editor";
import { WrapText, Link, Image, GalleryHorizontal } from "lucide-react";
import type { ICommand, TextAreaTextApi, TextState } from "@uiw/react-md-editor";
import { uploadImage, getMedia } from "../../queries";
import { imageUrl } from "../../utils/media";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Image as MediaImage } from "../../types/Image";
import SkeletonImg from "../SkeletonImg/SkeletonImg";
import CustomModal from "../AdminPanel/Modals/CustomModal/CustomModal";

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
        api.setSelectionRange({ start, end: start + placeholder.length });
        api.replaceSelection(`![${alt}](${url})`);
      } catch {
        api.setSelectionRange({ start, end: start + placeholder.length });
        api.replaceSelection("");
      }
    };
    input.click();
  },
};

const MediaPickerModal = ({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (img: MediaImage) => void;
}) => {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getMedia("images")
      .then((res) => setImages(res.data as MediaImage[]))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <CustomModal open={open} onClose={onClose}>
      <h2 className="font-semibold text-base">Выбрать изображение</h2>
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-6">Загрузка…</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Изображения не найдены</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onPick(img)}
              className="card overflow-hidden text-left hover:outline-2 hover:outline-primary transition-all"
            >
              <SkeletonImg
                src={imageUrl(img, "thumbnail")}
                alt={img.name}
                className="w-full aspect-video"
              />
              <p className="text-xs text-gray-600 truncate px-2 py-1">{img.name}</p>
            </button>
          ))}
        </div>
      )}
    </CustomModal>
  );
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
  const [pickerOpen, setPickerOpen] = useState(false);
  const pendingApiRef = useRef<{ state: TextState; api: TextAreaTextApi } | null>(null);

  useEffect(() => {
    if (height !== undefined) return;
    const onResize = () => setResponsiveHeight(computeResponsive());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, heightVh, minHeight, maxHeight]);

  const insertFromMediaCommand: ICommand = useMemo(() => ({
    name: "insert-from-media",
    keyCommand: "insert-from-media",
    buttonProps: { "aria-label": "Pick from media library" },
    icon: <GalleryHorizontal size={13} />,
    execute: (state: TextState, api: TextAreaTextApi) => {
      pendingApiRef.current = { state, api };
      setPickerOpen(true);
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const handlePick = (img: MediaImage) => {
    const pending = pendingApiRef.current;
    if (!pending) return;
    const { state, api } = pending;
    const alt = state.selectedText || img.name;
    const url = imageUrl(img, "large");
    api.replaceSelection(`![${alt}](${url})`);
    pendingApiRef.current = null;
    setPickerOpen(false);
  };

  return (
    <>
      <MDEditor
        value={value}
        height={height ?? responsiveHeight}
        commands={[
          insertBrCommand,
          insertEmptyLinkCommand,
          insertImageUploadCommand,
          insertFromMediaCommand,
          { keyCommand: "divider" },
          ...getCommands(),
        ]}
        visibleDragbar
        onChange={(val) => onChange(val ?? "")}
      />
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={handlePick}
      />
    </>
  );
};

export default CustomMDEditor;
