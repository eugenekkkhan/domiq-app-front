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

const extractTheme = (tp: Record<string, unknown>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(tp).filter(([, v]) => v !== undefined && v !== null)
  ) as Record<string, string>;

const waitForTheme = (): Promise<Record<string, string> | undefined> =>
  new Promise((resolve) => {
    const wa = window.WebApp;
    if (!wa) return resolve(undefined);

    const tp = wa.themeParams;
    if (tp && Object.keys(tp).length > 0) {
      return resolve(extractTheme(tp as unknown as Record<string, unknown>));
    }

    // themeParams not yet available — wait for themeChanged event with timeout
    let done = false;
    const finish = (result: Record<string, string> | undefined) => {
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
      finish(params ? extractTheme(params as Record<string, unknown>) : undefined);
    };

    const timer = setTimeout(() => finish(undefined), 500);
    wa.onEvent('themeChanged', handler);
  });

export const maxSdkInit = async (): Promise<Record<string, string> | undefined> => {
  await loadMaxScript();
  window.WebApp?.ready();
  return waitForTheme();
};
