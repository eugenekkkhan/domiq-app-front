import { useEffect, useState } from 'react';
import Banner from '../components/Banner/Banner';
import MainMenu from '../components/MainMenu/MainMenu';
import ButtonMain from '../components/Button/ButtonMain';
import NewsComponent from '../components/News/NewsComponent';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';

const MaxPage = () => {
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const user = window.WebApp?.initDataUnsafe?.user;
    if (user) {
      setUserId(user.id.toString());
    }
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
      <NewsComponent userId={userId} />
      <Banner />
      <MainMenu />
      <ButtonMain
        Icon={ChatBubbleRoundedIcon}
        text="Связь с оператором в Max"
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
      <ButtonMain
        Icon={ChatBubbleRoundedIcon}
        text="Связь с оператором в Telegram"
        color="#2AABEE"
        onClick={() => {
          if (window.WebApp) {
            window.WebApp.openLink('https://t.me/D0M_IQ');
          } else {
            location.href = 'https://t.me/D0M_IQ';
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
