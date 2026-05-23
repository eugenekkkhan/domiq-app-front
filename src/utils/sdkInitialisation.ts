import {
  backButton,
  emitEvent,
  init,
  initData,
  isTMA,
  miniApp,
  mockTelegramEnv,
  themeParams,
  viewport,
} from "@telegram-apps/sdk";

const defaultThemeParams = {
  accent_text_color: "#007aff",
  section_header_text_color: "#6d6d72",
  destructive_text_color: "#ff3b30",
  hint_color: "#8e8e93",
  button_color: "#007aff",
  secondary_bg_color: "#efeff4",
  bottom_bar_bg_color: "#f2f2f2",
  text_color: "#000000",
  header_bg_color: "#f8f8f8",
  subtitle_text_color: "#8e8e93",
  section_separator_color: "#c8c7cc",
  section_bg_color: "#ffffff",
  link_color: "#007aff",
  bg_color: "#ffffff",
  button_text_color: "#ffffff",
} as const;

export const sdkInit = async (themeOverride?: Record<string, string>, forceMock = false) => {
  if (forceMock || !isTMA()) {
    const noInsets = { left: 0, top: 0, bottom: 0, right: 0 } as const;
    const theme = themeOverride
      ? { ...defaultThemeParams, ...themeOverride }
      : defaultThemeParams;

    mockTelegramEnv({
      launchParams: {
        tgWebAppThemeParams: theme,
        tgWebAppData: new URLSearchParams([
          ["user", JSON.stringify({ id: 1, first_name: "Pavel" })],
          ["hash", ""],
          ["signature", ""],
          ["auth_date", Date.now().toString()],
        ]),
        tgWebAppStartParam: "debug",
        tgWebAppVersion: "8",
        tgWebAppPlatform: "tdesktop",
      },
      onEvent(e) {
        if (e[0] === "web_app_request_theme")
          return emitEvent("theme_changed", { theme_params: theme });
        if (e[0] === "web_app_request_viewport")
          return emitEvent("viewport_changed", {
            height: window.innerHeight,
            width: window.innerWidth,
            is_expanded: true,
            is_state_stable: true,
          });
        if (e[0] === "web_app_request_content_safe_area")
          return emitEvent("content_safe_area_changed", noInsets);
        if (e[0] === "web_app_request_safe_area")
          return emitEvent("safe_area_changed", noInsets);
      },
    });
  }

  init();
  backButton.mount();
  initData.restore();
  miniApp.mountSync();
  themeParams.mountSync();

  // Viewport async calls (mount + fullscreen) use AbortablePromise and wait for
  // a native bridge response. In the mock (Max or non-Telegram) they never resolve,
  // so skip them entirely when force-mocking.
  if (!forceMock) {
    if (viewport.mount.isAvailable()) {
      await viewport.mount();
      viewport.expand();
    }
    if (viewport.exitFullscreen.isAvailable()) {
      await viewport.exitFullscreen();
    }
  }

  miniApp.bindCssVars();
  themeParams.bindCssVars();
};
