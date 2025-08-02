import MainMenuElement from "./MainMenuElement/MainMenuElement";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

const MainMenu = () => {
  return (
    <div
      style={{
        borderRadius: "26px",
        padding: "0px 16px",
        color: "black",
        background: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MainMenuElement
        Icon={ErrorOutlineRoundedIcon}
        text="Проблемы с подключением"
        link="/connection-problems"
      />
      <MainMenuElement
        Icon={HelpOutlineRoundedIcon}
        text="Вопросы по работе камеры"
        link="/faq"
      />
      <MainMenuElement
        Icon={StarBorderRoundedIcon}
        text="Полезные функции"
        link="/features"
        isLast
      />
    </div>
  );
};

export default MainMenu;
