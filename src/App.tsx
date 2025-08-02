import Banner from "./components/Banner/Banner";
import MainMenu from "./components/MainMenu/MainMenu";
import ButtonMain from "./components/Button/ButtonMain";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import { useCloseButton } from "./customHooks/useCloseButton";

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
      <Banner />
      <MainMenu />
      <ButtonMain
        Icon={ChatBubbleRoundedIcon}
        text="Связь с оператором"
        color="#34C759"
        onClick={() => {
          location.href = "https://t.me/D0M_IQ";
        }}
      />
      {}
    </div>
  );
};

export default App;
