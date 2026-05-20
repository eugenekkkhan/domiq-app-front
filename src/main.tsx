import { createRoot } from "react-dom/client";
import "./index.css";
import RouterComponent from "./RouterComponent.tsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sdkInit } from "./utils/sdkInitialisation.ts";
import { maxSdkInit } from "./utils/maxSdkInit.ts";

const root = createRoot(document.getElementById("root")!);

if (window.location.pathname.startsWith("/max")) {
  // Max route: load Max SDK, then Telegram mock for shared UI components.
  // Pass Max themeParams so the mock uses real colors instead of hardcoded defaults.
  maxSdkInit().then((maxTheme) => sdkInit(maxTheme));
} else {
  sdkInit();
}

root.render(<RouterComponent />);
