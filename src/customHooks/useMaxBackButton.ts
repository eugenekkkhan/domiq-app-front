import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

export const useMaxBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleButtonClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const backButton = window.WebApp?.BackButton;
    if (!backButton) return;

    const isRoot = location.pathname === '/max' || location.pathname === '/max/';
    if (isRoot) {
      backButton.hide();
    } else {
      backButton.show();
    }

    backButton.onClick(handleButtonClick);
    return () => {
      backButton.offClick(handleButtonClick);
    };
  }, [location.pathname, handleButtonClick]);
};
