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

export const maxSdkInit = async () => {
  await loadMaxScript();
  window.WebApp?.ready();
};
