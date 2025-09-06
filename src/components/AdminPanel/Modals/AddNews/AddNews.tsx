import Button from "@mui/material/Button";
import { useState } from "react";
import { createNews } from "../../../../queries";
import CustomMDEditor from "../../../CustomMDEditor/CustomMDEditor";
import CustomModal from "../CustomModal/CustomModal";

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
      <CustomModal open={open} onClose={handleClose} fullWidth>
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
      </CustomModal>
    </>
  );
}
