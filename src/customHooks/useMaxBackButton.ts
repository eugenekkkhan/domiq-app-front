import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';

export const useMaxBackButton = () => {
  const navigate = useNavigate();
  const handleButtonClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const backButton = window.WebApp?.BackButton;
    if (!backButton) return;

    if (location.pathname === '/max') {
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
