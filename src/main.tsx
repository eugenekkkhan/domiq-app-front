import { createRoot } from "react-dom/client";
import "./index.css";
import RouterComponent from "./RouterComponent.tsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sdkInit } from "./utils/sdkInitialisation.ts";
import { maxSdkInit } from "./utils/maxSdkInit.ts";

const root = createRoot(document.getElementById("root")!);

const isMax =
  window.location.pathname.startsWith("/max-miniapp") ||
  window.location.pathname.startsWith("/max");

const init = async () => {
  try {
    if (isMax) {
      const maxTheme = await maxSdkInit();
      await sdkInit(maxTheme, true);
    } else {
      await sdkInit();
    }
  } catch (e) {
    console.error("SDK init failed:", e);
  }
  root.render(<RouterComponent />);
};

init();
