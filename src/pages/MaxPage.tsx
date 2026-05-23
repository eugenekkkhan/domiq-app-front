import { useEffect, useState } from 'react';
import Banner from '../components/Banner/Banner';
import MainMenu from '../components/MainMenu/MainMenu';
import ButtonMain from '../components/Button/ButtonMain';
import NewsComponent from '../components/News/NewsComponent';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';

type SdkDebug = {
  hasWebApp: boolean;
  colorScheme: string;
  themeParams: string;
  backButtonType: string;
  platform: string;
};

const MaxPage = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const [debug, setDebug] = useState<SdkDebug | null>(null);

  useEffect(() => {
    const user = window.WebApp?.initDataUnsafe?.user;
    if (user) {
      setUserId(user.id.toString());
    }

    const wa = window.WebApp;
    setDebug({
      hasWebApp: !!wa,
      colorScheme: wa?.colorScheme ?? 'undefined',
      themeParams: JSON.stringify(wa?.themeParams ?? null),
      backButtonType: typeof wa?.BackButton,
      platform: wa?.platform ?? 'undefined',
    });
  }, []);

  return (
    <div
      style={{
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {debug && (
        <pre
          style={{
            fontSize: '10px',
            background: '#222',
            color: '#0f0',
            padding: '8px',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: '0 8px',
          }}
        >
          {JSON.stringify(debug, null, 2)}
        </pre>
      )}
      <NewsComponent userId={userId} />
      <Banner />
      <MainMenu />
      <ButtonMain
        Icon={ChatBubbleRoundedIcon}
        text="Связь с оператором"
        color="#34C759"
        onClick={() => {
          if (window.WebApp) {
            window.WebApp.openLink('https://max.ru/D0M_IQ');
          } else {
            location.href = 'https://max.ru/D0M_IQ';
          }
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          gap: '8px',
        }}
      />
    </div>
  );
};

export default MaxPage;
