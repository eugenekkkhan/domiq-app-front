import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import {
  getAllUsersData,
  // getUsersDevices,
} from "../../../../queries";
import CustomModal from "../CustomModal/CustomModal";

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
      <CustomModal open={open} onClose={handleClose}>
        <h3>Статистика</h3>
        <Button
          variant="contained"
          href={links.users}
          download
          loading={loading.users}
        >
          Получить данные всех пользователей
        </Button>
        {/* <Button variant="contained" href={links.devices} download loading={loading.devices}>
          Получить данные об устройствах пользователей
        </Button> */}
        <Button variant="outlined" onClick={handleClose}>
          Закрыть
        </Button>
      </CustomModal>
    </>
  );
}
