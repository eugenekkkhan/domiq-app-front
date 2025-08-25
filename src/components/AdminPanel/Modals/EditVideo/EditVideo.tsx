import type { Theme } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import type { SxProps } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { updateVideo, uploadMedia } from "../../../../queries";
import { MuiFileInput } from "mui-file-input";
import type { Video } from "../../../../types/video";

const style: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

export default function EditVideo({ video }: { video: Video }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [form, setForm] = useState({
    name: video.name,
    videoLink: video.source,
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
    });
  };

  const [file, setFile] = useState<File | null>(null);

  function handleChangeFile(event: File | null) {
    setFile(event);
  }

  useEffect(() => {
    if (file) {
      uploadMedia(file).then((response) => {
        setForm({
          ...form,
          videoLink: response.data,
        });
        setFile(null);
      });
    }
  }, [file]);

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
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
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
          <div style={{ display: "flex", justifyContent: "end", gap: "8px" }}>
            {(form.name !== video.name || form.videoLink !== video.source) && (
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
              disabled={form.name === video.name && form.videoLink === video.source}
              onClick={() => {
                updateVideo({
                  id: video.ID.toString(),
                  name: form.name,
                  videoLink: form.videoLink,
                  CreatedAt: video.CreatedAt || "",
                  thumbnail: video.thumbnail,
                  duration: video.duration
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
        </Box>
      </Modal>
    </>
  );
}
