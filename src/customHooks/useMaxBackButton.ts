import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';

export const useMaxBackButton = () => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const location = useLocation();

  useEffect(() => {
    const wa = window.WebApp;
    if (!wa) return;

    // With BrowserRouter basename set, React Router strips the base —
    // root is '/' regardless of whether the app is at /max or /max-miniapp
    const isRoot = location.pathname === '/' || location.pathname === '';

    if (isRoot) {
      wa.BackButton.hide();
    } else {
      wa.BackButton.show();
    }

    const handler = () => navigateRef.current(-1);
    wa.BackButton.onClick(handler);
    wa.onEvent('backButtonClicked', handler);

    return () => {
      wa.BackButton.offClick(handler);
      wa.offEvent('backButtonClicked', handler);
    };
  }, [location.pathname]);
};
