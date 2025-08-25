import type { Theme } from "@emotion/react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import type { SxProps } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  getAllUsersData,
  // getUsersDevices,
} from "../../../../queries";
import Button from "@mui/material/Button";

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

export default function Statistics({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [links, setLinks] = useState({
    users: "",
    devices: "",
  });

  const [loading, setLoading] = useState({
    users: false,
    devices: false,
  });

  useEffect(() => {
    setLoading((prev) => ({ ...prev, users: true }));
    getAllUsersData().then((response) => {
      setLinks((prev) => ({ ...prev, users: response.data }));
      setLoading((prev) => ({ ...prev, users: false }));
    });
    // getUsersDevices().then((response) => {
    //   setLinks((prev) => ({ ...prev, devices: response.data }));
    //   setLoading((prev) => ({ ...prev, devices: false }));
    // });
  }, [open]);

  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3>Статистика</h3>
          <Button variant="contained" href={links.users} download loading={loading.users}>
            Получить данные всех пользователей
          </Button>
          {/* <Button variant="contained" href={links.devices} download loading={loading.devices}>
            Получить данные об устройствах пользователей
          </Button> */}
          <Button variant="outlined" onClick={handleClose}>
            Закрыть
          </Button>
        </Box>
      </Modal>
    </>
  );
}
