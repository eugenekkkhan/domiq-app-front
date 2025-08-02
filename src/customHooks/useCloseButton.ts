import { backButton } from "@telegram-apps/sdk";
import { useEffect } from "react";

export const useCloseButton = () =>
  useEffect(() => {
    if (backButton.mount.ifAvailable())
      backButton.hide();
  }, []);
