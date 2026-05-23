const loadMaxScript = (): Promise<void> =>
  new Promise((resolve) => {
    if (window.WebApp) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://st.max.ru/js/max-web-app.js';
    script.onload = () => resolve();
    // Resolve even on error — just means we're outside Max environment
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });

const lightDefaults: Record<string, string> = {
  accent_text_color: '#007aff',
  section_header_text_color: '#6d6d72',
  destructive_text_color: '#ff3b30',
  hint_color: '#8e8e93',
  button_color: '#007aff',
  secondary_bg_color: '#efeff4',
  bottom_bar_bg_color: '#f2f2f2',
  text_color: '#000000',
  header_bg_color: '#f8f8f8',
  subtitle_text_color: '#8e8e93',
  section_separator_color: '#c8c7cc',
  section_bg_color: '#ffffff',
  link_color: '#007aff',
  bg_color: '#ffffff',
  button_text_color: '#ffffff',
};

const darkDefaults: Record<string, string> = {
  accent_text_color: '#0a84ff',
  section_header_text_color: '#8d8e93',
  destructive_text_color: '#ff453a',
  hint_color: '#8d8e93',
  button_color: '#0a84ff',
  secondary_bg_color: '#1c1c1e',
  bottom_bar_bg_color: '#1c1c1e',
  text_color: '#ffffff',
  header_bg_color: '#1c1c1e',
  subtitle_text_color: '#8d8e93',
  section_separator_color: '#38383a',
  section_bg_color: '#2c2c2e',
  link_color: '#0a84ff',
  bg_color: '#000000',
  button_text_color: '#ffffff',
};

const extractTheme = (tp: Record<string, unknown>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(tp).filter(([, v]) => v !== undefined && v !== null)
  ) as Record<string, string>;

const waitForTheme = (): Promise<Record<string, string>> =>
  new Promise((resolve) => {
    const wa = window.WebApp;
    // Outside Max — return light defaults; sdkInit will use its own defaults anyway
    if (!wa) return resolve(lightDefaults);

    const schemeDefaults = () =>
      wa.colorScheme === 'dark' ? darkDefaults : lightDefaults;

    // Try synchronous themeParams first
    const tp = wa.themeParams;
    if (tp && Object.keys(tp).length > 0) {
      return resolve(extractTheme(tp as unknown as Record<string, unknown>));
    }

    // colorScheme already known — use palette defaults immediately
    if (wa.colorScheme) {
      return resolve(schemeDefaults());
    }

    // Wait for themeChanged event with 500 ms timeout
    let done = false;
    const finish = (result: Record<string, string>) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      wa.offEvent('themeChanged', handler);
      resolve(result);
    };

    const handler = (data: unknown) => {
      const params =
        (data as { theme_params?: Record<string, string> })?.theme_params ??
        wa.themeParams;
      finish(
        params
          ? extractTheme(params as Record<string, unknown>)
          : schemeDefaults(),
      );
    };

    const timer = setTimeout(() => finish(schemeDefaults()), 500);
    wa.onEvent('themeChanged', handler);
  });

export const maxSdkInit = async (): Promise<Record<string, string>> => {
  await loadMaxScript();
  window.WebApp?.ready();
  return waitForTheme();
};
