import { backButton } from "@telegram-apps/sdk";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

export const useBackButton = () => {
  const navigate = useNavigate();
  const handleButtonClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === "/") {
      if (backButton.isVisible()) {
        backButton.hide();
      }
    } else {
      if (!backButton.isVisible()) {
        backButton.show();
      }
    }
    backButton.onClick(handleButtonClick);
    return () => {
      backButton.offClick(handleButtonClick);
    };
  }, [location.pathname, backButton, handleButtonClick]);
};
