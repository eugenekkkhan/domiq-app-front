import Button from "@mui/material/Button";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { sendMailing } from "../../../../queries";
import CustomModal from "../CustomModal/CustomModal";

export default function Mailing({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [mailError, setMailError] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <CustomModal open={open} onClose={handleClose}>
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
      </CustomModal>
    </>
  );
}
