import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import type { SxProps } from "@mui/material/styles";
import type { Theme } from "@emotion/react";
import {
  getAllArticles,
  getArticle,
  updateArticle,
} from "../../../../queries";
import type { ArticleType } from "../../../../types/Article";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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

export default function EditArticle({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [initialForm, setInitialForm] = useState({
    header: "",
    content: "",
    parentId: null as number | null,
    type: "article" as "article" | "section",
  });

  const [data, setData] = useState<ArticleType[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formElement: string
  ) => {
    setForm({ ...form, [formElement]: e.target.value });
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    getArticle(id.toString()).then((res) => {
      getAllArticles().then((response) => {
        const articles = response.data as ArticleType[];
        setData(articles.filter((article) => article.type === "section"));
      });
      const fetchedData = res.data as ArticleType;
      setInitialForm({
        header: fetchedData.header,
        content: fetchedData.content,
        parentId: fetchedData.parent_id,
        type: fetchedData.type,
      });
      setForm({
        header: fetchedData.header,
        content: fetchedData.content,
        parentId: fetchedData.parent_id,
        type: fetchedData.type,
      });
    });
  }, [open]);

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
          <TextField
            label="Заголовок"
            variant="outlined"
            fullWidth
            value={form.header}
            onChange={(e) => setForm({ ...form, header: e.target.value })}
          />
          <FormControl fullWidth required>
            <InputLabel>Раздел</InputLabel>
            <Select
              label="Раздел"
              onChange={(e) =>
                handleChange(
                  e as React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >,
                  "parentId"
                )
              }
              value={form.parentId}
            >
              {data.map((item) => (
                <MenuItem key={item.id} value={item.id as number}>
                  {item.header}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {form.type === "article" && (
            <CustomMDEditor
              value={form.content}
              onChange={(value) =>
                setForm({ ...form, content: value as string })
              }
            />
          )}
          <div style={{ display: "flex", justifyContent: "end", gap: "8px" }}>
            {(form.header !== initialForm.header ||
              form.content !== initialForm.content ||
              form.parentId !== initialForm.parentId) && (
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
              disabled={
                form.type === "article"
                  ? form.header === initialForm.header &&
                    form.content === initialForm.content &&
                    form.parentId === initialForm.parentId
                  : form.header === initialForm.header &&
                    form.parentId === initialForm.parentId
              }
              onClick={() => {
                handleClose();
                updateArticle({
                  content: form.content,
                  header: form.header,
                  parent_id: form.parentId,
                  type: form.type,
                  id: id,
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
