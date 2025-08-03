import { themeParams } from "@telegram-apps/sdk";
import { useEffect } from "react";

const useCustomTheme = () => {
  useEffect(() => {
    if (document) {
      const element = document.getElementById("body");
      if (themeParams.isMounted() && element) {
        element.style.backgroundColor = themeParams.secondaryBackgroundColor() || "";
      }
    }
  }, []);
};

export default useCustomTheme;
