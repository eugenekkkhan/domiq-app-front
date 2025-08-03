import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { NavLink } from "react-router";
import { themeParams } from "@telegram-apps/sdk";

const MainMenuElement = ({
  Icon,
  text,
  isLast = false,
  link,
}: {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  text: string;
  isLast?: boolean;
  link: string;
}) => {
  return (
    <NavLink to={link}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 0px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            position: "relative",
          }}
        >
          <Icon
            style={{
              color: themeParams.buttonColor(),
              width: "22px",
              height: "22px",
            }}
          />
          <p>{text}</p>
        </div>
        {!isLast && (
          <span
            id="line"
            style={{
              position: "absolute",
              bottom: "0",
              right: "-16px",
              backgroundColor: themeParams.sectionSeparatorColor(),
              width: "calc(100% - 18px)",
              height: "0.33px",
            }}
          ></span>
        )}
        <KeyboardArrowRightRoundedIcon
          style={{ color: themeParams.sectionSeparatorColor() }}
        />
      </div>
    </NavLink>
  );
};

export default MainMenuElement;
