import type { Theme } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import type { SxProps } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import {
  createArticle,
  getAllArticles,
  uploadMedia,
} from "../../../../queries";
import type { ArticleType } from "../../../../types/Article";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { MuiFileInput } from "mui-file-input";
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

export default function AddArticle() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [form, setForm] = useState({
    header: "",
    parentId: "",
    content: "",
    type: "article" as "article" | "section",
  });

  const [data, setData] = useState<ArticleType[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formElement: string
  ) => {
    setForm({ ...form, [formElement]: e.target.value });
  };

  useEffect(() => {
    getAllArticles().then((response) => {
      const articles = response.data as ArticleType[];
      setData(articles.filter((article) => article.type === "section"));
    });
  }, [open]);

  const resetData = () => {
    setForm({
      header: "",
      content: "",
      parentId: "",
      type: form.type,
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
          content: form.content.concat(
            `![image](${
              import.meta.env.VITE_API_LINK +
              response.data.replaceAll(" ", "%20")
            })`
          ),
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
        sx={{ minWidth: "200px" }}
      >
        Добавить статью
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3>Добавление статьи</h3>
          <TextField
            value={form.header}
            label={`Заголовок ${
              form.type === "article" ? "статьи" : "раздела"
            }`}
            variant="outlined"
            required
            fullWidth
            onChange={(e) => handleChange(e, "header")}
          />
          <ButtonGroup fullWidth>
            <Button
              variant={form.type === "article" ? "contained" : "outlined"}
              onClick={() => setForm({ ...form, type: "article" })}
            >
              Статья
            </Button>
            <Button
              variant={form.type === "section" ? "contained" : "outlined"}
              onClick={() => setForm({ ...form, type: "section" })}
            >
              Раздел
            </Button>
          </ButtonGroup>
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

          <MuiFileInput
            label="Добавление изображения"
            placeholder="Выберите файл для добавления"
            value={file}
            onChange={(e) => handleChangeFile(e)}
          />

          {form.type === "article" && (
            <CustomMDEditor
              value={form.content}
              onChange={(value) =>
                setForm({ ...form, content: value as string })
              }
            />
          )}
          <div style={{ display: "flex", justifyContent: "end", gap: "8px" }}>
            {(form.header || form.content || form.parentId) && (
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
                form.type === "article"
                  ? !form.header || !form.content || !form.parentId
                  : !form.header || !form.parentId
              }
              onClick={() => {
                handleClose();
                createArticle({
                  id: null,
                  header: form.header,
                  content: form.content,
                  parent_id: parseInt(form.parentId),
                  type: form.type,
                }).then(() => {
                  resetData();
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
