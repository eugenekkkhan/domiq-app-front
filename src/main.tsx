import { createRoot } from "react-dom/client";
import "./index.css";
import RouterComponent from "./RouterComponent.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { sdkInit } from "./utils/sdkInitialisation.ts";

const root = createRoot(document.getElementById("root")!);
sdkInit();
root.render(<RouterComponent />);
