import Banner from "./components/Banner/Banner";
import MainMenu from "./components/MainMenu/MainMenu";
import ButtonMain from "./components/Button/ButtonMain";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import { useCloseButton } from "./customHooks/useCloseButton";
import NewsComponent from "./components/News/NewsComponent";

const App = () => {
  useCloseButton();
  return (
    <div
      style={{
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <NewsComponent />
      <Banner />
      <MainMenu />
      <ButtonMain
        Icon={ChatBubbleRoundedIcon}
        text="Связь с оператором"
        color="#34C759"
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
    </div>
  );
};

export default App;
