import { backButton } from "@telegram-apps/sdk";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useBackButton = () => {
  const navigate = useNavigate();
  useEffect(() => {
    backButton.show();
    backButton.onClick(() => {
      navigate(-1);
    });
  }, [window.location.pathname]);
};