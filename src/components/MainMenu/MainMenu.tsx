import MainMenuElement from "./MainMenuElement/MainMenuElement";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import { themeParams } from "@telegram-apps/sdk";
import type { MenuItem } from "../../types/MenuItem";

const init: MenuItem[] = [
  {
    Icon: ErrorOutlineRoundedIcon,
    header: "Проблемы с подключением",
    id: 1,
  },
  {
    Icon: HelpOutlineRoundedIcon,
    header: "Вопросы по работе камеры",
    id: 2,
  },
  {
    Icon: StarBorderRoundedIcon,
    header: "Полезные функции",
    id: 3,
    isLast: true,
  },
];

const makeLastTrue = (items: MenuItem[]) => {
  const lastItem = items[items.length - 1];
  if (lastItem) {
    lastItem.isLast = true;
  }
};

const MainMenu = ({ initialValues = init }: { initialValues?: MenuItem[] }) => {
  makeLastTrue(initialValues);
  return (
    <div
      style={{
        borderRadius: "26px",
        padding: "0px 16px",
        background: themeParams.sectionBackgroundColor(),
        display: "flex",
        flexDirection: "column",
      }}
    >
      {initialValues.map((item, index) => (
        <MainMenuElement
          key={index}
          Icon={item.Icon}
          text={item.header}
          link={item.link}
          id={item.id ? item.id.toString() : undefined}
          isLast={item.isLast}
        />
      ))}
    </div>
  );
};

export default MainMenu;
