import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { getNewsById, updateNews } from "../../../../queries";
import type { NewArticle } from "../../../../types/NewArticle";
import CustomMDEditor from "../../../CustomMDEditor/CustomMDEditor";
import CustomModal from "../CustomModal/CustomModal";

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
      <CustomModal open={open} onClose={handleClose} fullWidth>
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
      </CustomModal>
    </>
  );
}
