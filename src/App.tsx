import Banner from "./components/Banner/Banner";
import MainMenu from "./components/MainMenu/MainMenu";
import ButtonMain from "./components/Button/ButtonMain";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import NewsComponent from "./components/News/NewsComponent";

const App = () => {
  return (
    <div
      style={{
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {import.meta.env.VITE_DEV_STATUS === "development" && "development"}
      <NewsComponent />
      <Banner />
      <MainMenu />
      <ButtonMain
        Icon={ChatBubbleRoundedIcon}
        text="Связь с оператором в Telegram"
        color="#2AABEE"
        onClick={() => {
          location.href = "https://t.me/D0M_IQ";
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          gap: "8px",
        }}
      />
      <ButtonMain
        Icon={ChatBubbleRoundedIcon}
        text="Связь с оператором в Max"
        color="#34C759"
        onClick={() => {
          location.href = "https://max.ru/u/f9LHodD0cOJL9Yv6fAZ1IDrmJHG0AFl8iRBJFv0Ja8GruE4jeQrjJmP9txs";
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          gap: "8px",
        }}
      />
    </div>
  );
};

export default App;
