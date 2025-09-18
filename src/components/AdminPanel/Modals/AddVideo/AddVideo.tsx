import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { createVideo, uploadMedia } from "../../../../queries";
import { MuiFileInput } from "mui-file-input";
import CustomModal from "../CustomModal/CustomModal";

export default function AddVideo() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [form, setForm] = useState({
    name: "",
    videoLink: "",
    thumbnailLink: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formElement: string
  ) => {
    setForm({ ...form, [formElement]: e.target.value });
  };

  const resetData = () => {
    setForm({
      name: "",
      videoLink: "",
      thumbnailLink: "",
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
        sx={{ minWidth: "200px" }}
      >
        Добавить видео
      </Button>
      <CustomModal open={open} onClose={handleClose} fullWidth>
        <h3>Добавление видео</h3>
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
          {(form.name || form.videoLink) && (
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
            disabled={form.name === "" || form.videoLink === ""}
            onClick={() => {
              createVideo({
                name: form.name,
                videoLink: form.videoLink,
                thumbnailLink: form.thumbnailLink,
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
