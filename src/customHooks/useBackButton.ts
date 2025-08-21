import { backButton } from "@telegram-apps/sdk";
import { useEffect } from "react";

export const useBackButton = () =>
  useEffect(() => {
    backButton.onClick(() => {
      window.history.back();
    });
    backButton.show();
  }, []);
