import { createRoot } from "react-dom/client";
import "./index.css";
import RouterComponent from "./RouterComponent.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { init, initData } from "@telegram-apps/sdk-react";
// import { BackButton } from "./BackButton.js";

// Initialize the package.
init();

// Mount the Back Button, so we will work with
// the actual component properties.
initData.restore();

createRoot(document.getElementById("root")!).render(<RouterComponent/>);
