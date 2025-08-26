import type { Theme } from "@emotion/react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import type { SxProps } from "@mui/material/styles";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { sendMailing } from "../../../../queries";

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

export default function Mailing({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [mailError, setMailError] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3>Рассылка</h3>
          <TextField
            error={!!mailError}
            rows={4}
            multiline
            variant="outlined"
            placeholder="Введите текст рассылки"
            helperText={mailError}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              sendMailing(message)
                .then(() => {
                  setMessage("");
                  setMailError(null);
                  handleClose();
                })
                .catch(() => {
                  setMailError("Ошибка отправки рассылки");
                });
            }}
            disabled={!message}
            disableElevation
          >
            Отправить
          </Button>
          {message && (
            <Button
              variant="outlined"
              onClick={() => {
                setMessage("");
              }}
            >
              Очистить
            </Button>
          )}
          <Button variant="outlined" onClick={handleClose}>
            Закрыть
          </Button>
        </Box>
      </Modal>
    </>
  );
}
