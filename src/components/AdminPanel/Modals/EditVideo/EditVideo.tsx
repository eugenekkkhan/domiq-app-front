import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { updateVideo, uploadMedia } from "../../../../queries";
import { MuiFileInput } from "mui-file-input";
import type { Video } from "../../../../types/video";
import CustomModal from "../CustomModal/CustomModal";

export default function EditVideo({ video }: { video: Video }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [form, setForm] = useState({
    name: video.name,
    videoLink: video.source,
    thumbnailLink: video.thumbnail || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formElement: string
  ) => {
    setForm({ ...form, [formElement]: e.target.value });
  };

  const resetData = () => {
    setForm({
      name: video.name,
      videoLink: video.source,
      thumbnailLink: video.thumbnail || "",
    });
  };

  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  function handleChangeFile(event: File | null) {
    setFile(event);
  }
  const handleThumbnailChangeFile = (event: File | null) => {
    setThumbnailFile(event);
  };

  useEffect(() => {
    if (file) {
      uploadMedia(file).then((response) => {
        setForm((prev) => ({
          ...prev,
          videoLink: response.data,
        }));
        setFile(null);
      });
    }
  }, [file]);
  useEffect(() => {
    if (thumbnailFile) {
      uploadMedia(thumbnailFile).then((response) => {
        setForm((prev) => ({
          ...prev,
          thumbnailLink: response.data,
        }));
        setThumbnailFile(null);
      });
    }
  }, [thumbnailFile]);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        disableElevation
        sx={{ minWidth: "50%" }}
      >
        Редактировать
      </Button>
      <CustomModal open={open} onClose={handleClose} fullWidth>
        <h3>Редактирование видео</h3>
        <TextField
          value={form.name}
          label={"Название видео"}
          variant="outlined"
          required
          fullWidth
          onChange={(e) => handleChange(e, "name")}
        />

        <MuiFileInput
          label="Добавление видео"
          placeholder="Выберите файл для добавления"
          value={file}
          onChange={(e) => handleChangeFile(e)}
          helperText={
            form.videoLink && `Загруженное видео: ${form.videoLink.slice(7)}`
          }
        />
        <MuiFileInput
          label="Добавление превью (thumbnail)"
          placeholder="Выберите изображение превью"
          value={thumbnailFile}
          onChange={(e) => handleThumbnailChangeFile(e)}
          helperText={
            form.thumbnailLink &&
            `Загруженное превью: ${form.thumbnailLink.slice(7)}`
          }
        />
        {form.thumbnailLink && (
          <img
            src={import.meta.env.VITE_API_LINK + form.thumbnailLink}
            style={{ maxWidth: "200px", borderRadius: 8 }}
            alt="preview"
          />
        )}
        <div style={{ display: "flex", justifyContent: "end", gap: "8px" }}>
          {(form.name !== video.name || form.videoLink !== video.source || form.thumbnailLink !== (video.thumbnail || "")) && (
            <Button
              variant="outlined"
              onClick={() => {
                resetData();
              }}
            >
              Очистить
            </Button>
          )}
          <Button
            variant="contained"
            disabled={
              form.name === video.name &&
              form.videoLink === video.source &&
              form.thumbnailLink === (video.thumbnail || "")
            }
            onClick={() => {
              updateVideo({
                id: video.ID.toString(),
                name: form.name,
                videoLink: form.videoLink,
                CreatedAt: video.CreatedAt || "",
                thumbnail: form.thumbnailLink,
                duration: video.duration,
              }).then(() => {
                resetData();
                handleClose();
                window.location.reload();
              });
            }}
          >
            Сохранить
          </Button>
        </div>
      </CustomModal>
    </>
  );
}
