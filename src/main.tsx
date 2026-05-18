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

const root = createRoot(document.getElementById("root")!);

root.render(
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <SidebarProvider>
        <RouterComponent />
      </SidebarProvider>
      <ToastContainer />
    </ToastProvider>
  </QueryClientProvider>,
);

// Load theme and settings in the background — app renders immediately with defaults.
// Requests are given a hard timeout so they never hang indefinitely.
const fetchTimeout = (url: string, ms = 5000): Promise<Response> => {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
};

const base = import.meta.env.VITE_API_URL as string;
Promise.allSettled([
  fetchTimeout(`${base}/theme`).then((r) => { if (r.ok) r.json().then(applyTheme); }),
  fetchTimeout(`${base}/settings`).then((r) => { if (r.ok) r.json().then(applySettings); }),
]);
