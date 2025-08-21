import { createRoot } from "react-dom/client";
import "./index.css";
import RouterComponent from "./RouterComponent.tsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sdkInit } from "./utils/sdkInitialisation.ts";

const root = createRoot(document.getElementById("root")!);
sdkInit();
root.render(<RouterComponent />);
