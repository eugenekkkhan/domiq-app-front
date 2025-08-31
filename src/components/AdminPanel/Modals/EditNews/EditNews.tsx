import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import type { SxProps } from "@mui/material/styles";
import type { Theme } from "@emotion/react";
import { getNewsById, updateNews } from "../../../../queries";
import type { NewArticle } from "../../../../types/NewArticle";
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

export default function EditNews({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [initialForm, setInitialForm] = useState({
    content: "",
    createdAt: "",
  });

  useEffect(() => {
    getNewsById(id.toString()).then((res) => {
      const fetchedData = res.data as NewArticle;
      setInitialForm({
        content: fetchedData.content,
        createdAt: fetchedData.CreatedAt,
      });
      setForm({
        content: fetchedData.content,
        createdAt: fetchedData.CreatedAt,
      });
    });
  }, [open]);

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
        fullWidth
      >
        Редактировать
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3>Редактирование</h3>
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
                updateNews({
                  id: id.toString(),
                  createdAt: form.createdAt,
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
