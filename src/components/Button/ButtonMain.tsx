import type { SvgIconTypeMap } from "@mui/material/SvgIcon";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { ComponentProps } from "react";
import { themeParams } from "@telegram-apps/sdk";

interface Props extends ComponentProps<"button"> {
  color: string;
  text: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

const ButtonMain = ({ color, text, Icon, ...props }: Props) => {
  return (
    <button
      style={{
        padding: "16px",
        borderRadius: "26px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: themeParams.sectionBackgroundColor(),
        color: color,
        border: "none",
        cursor: "pointer",
      }}
      {...props}
    >
      <Icon style={{ width: "20px", height: "20px" }} />
      <p
        style={{
          fontSize: "13px",
          lineHeight: "18px",
          letterSpacing: "-0.08px",
        }}
      >
        {text}
      </p>
    </button>
  );
};

export default ButtonMain;
