import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import RouterComponent from "./RouterComponent.tsx";
import { applyTheme } from "./utils/theme.ts";
import { applySettings } from "./utils/settings.ts";
import { SidebarProvider } from "./contexts/SidebarContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ToastContainer } from "./components/Toast/ToastContainer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const init = async () => {
  try {
    const base = import.meta.env.VITE_API_URL as string;
    const [themeRes, settingsRes] = await Promise.all([
      fetch(`${base}/theme`),
      fetch(`${base}/settings`),
    ]);
    if (themeRes.ok) applyTheme(await themeRes.json());
    if (settingsRes.ok) applySettings(await settingsRes.json());
  } catch (err) {
    console.error("Failed to load initial theme/settings", err);
  }

  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SidebarProvider>
          <RouterComponent />
        </SidebarProvider>
        <ToastContainer />
      </ToastProvider>
    </QueryClientProvider>,
  );
};

init();
