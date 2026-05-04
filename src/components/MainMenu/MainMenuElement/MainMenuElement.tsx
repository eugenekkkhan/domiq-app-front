import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router";

type MainMenuElementProps = {
  text: string;
  to: string;
  isLast?: boolean;
};

const MainMenuElement = ({
  text,
  to,
  isLast = false,
}: MainMenuElementProps) => {
  return (
    <NavLink to={to}>
      <div
        className={`flex items-center justify-between p-[var(--spacing-card)] ${
          !isLast ? "border-b border-border" : ""
        }`}
      >
        <span className="text-[17px] leading-snug">{text}</span>
        <ChevronRight size={18} className="text-gray-300 shrink-0" />
      </div>
    </NavLink>
  );
};

export default MainMenuElement;
