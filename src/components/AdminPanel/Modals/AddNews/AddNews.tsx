import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import type { SxProps } from "@mui/material/styles";
import type { Theme } from "@emotion/react";
import { createNews } from "../../../../queries";
import CustomMDEditor from "../../../CustomMDEditor/CustomMDEditor";

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

export default function AddNews() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [initialForm] = useState({
    content: "",
    createdAt: "",
  });

  const [form, setForm] = useState(initialForm);

  const resetData = () => {
    setForm(initialForm);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        disableElevation
        sx={{ minWidth: "200px" }}
      >
        Добавить новость
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3>Добавление новости</h3>
          <CustomMDEditor
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value as string })}
          />

          <div style={{ display: "flex", justifyContent: "end", gap: "8px" }}>
            {form.content !== initialForm.content && (
              <Button
                variant="outlined"
                onClick={() => {
                  resetData();
                }}
              >
                Сброс изменений
              </Button>
            )}
            <Button
              variant="contained"
              disabled={form.content === initialForm.content}
              onClick={() => {
                handleClose();
                createNews({
                  content: form.content,
                }).then(() => {
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
