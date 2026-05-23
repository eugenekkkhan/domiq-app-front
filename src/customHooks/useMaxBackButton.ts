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

    const isRoot =
      location.pathname === '/max' || location.pathname === '/max/';

    if (isRoot) {
      wa.BackButton.hide();
    } else {
      wa.BackButton.show();
    }

    // Stable handler — always reads latest navigate via ref
    const handler = () => navigateRef.current(-1);

    wa.BackButton.onClick(handler);

    // Also listen via the raw event channel as a fallback
    const eventHandler = () => navigateRef.current(-1);
    wa.onEvent('backButtonClicked', eventHandler);

    return () => {
      wa.BackButton.offClick(handler);
      wa.offEvent('backButtonClicked', eventHandler);
    };
  }, [location.pathname]);
};
