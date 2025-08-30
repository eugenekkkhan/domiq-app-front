import { backButton } from "@telegram-apps/sdk";
import { useCallback, useContext, useEffect } from "react";
import { UNSAFE_NavigationContext } from "react-router";

export const useBackButton = () => {
  // Detect if we are inside a React Router context without calling useNavigate
  const navCtx = useContext(UNSAFE_NavigationContext as any) as {
    navigator?: { go?: (n: number) => void };
  } | null;
  const canUseRouter = Boolean(navCtx?.navigator?.go);

  const handleButtonClick = useCallback(() => {
    if (canUseRouter && navCtx?.navigator?.go) {
      try {
        navCtx.navigator.go(-1);
        return;
      } catch (_) {
        // fall through to history fallback
      }
    }
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign("/");
    }
  }, [canUseRouter, navCtx]);

  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    if (path === "/") {
      if (backButton.isVisible()) backButton.hide();
    } else {
      if (!backButton.isVisible()) backButton.show();
    }

    backButton.onClick(handleButtonClick);
    return () => {
      backButton.offClick(handleButtonClick);
    };
    // Re-run when the path string changes (component will re-render on route change)
  }, [path, handleButtonClick]);
};
