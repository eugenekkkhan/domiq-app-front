import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import type { SxProps } from "@mui/material/styles";
import type { Theme } from "@emotion/react";
import React from "react";

export default function CustomModal({
  open,
  onClose,
  children,
  fullWidth,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {

  const style: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: fullWidth ? "calc(100% - 32px)" : "80%",
    bgcolor: "background.paper",
    borderRadius: "12px",
    boxShadow: 24,
    p: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>{children}</Box>
    </Modal>
  );
}
