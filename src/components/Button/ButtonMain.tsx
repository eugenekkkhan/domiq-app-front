import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";

interface Props extends ComponentProps<"button"> {
  color?: string;
  text: string;
  Icon?: LucideIcon;
}

const ButtonMain = ({ color = "#007aff", text, Icon, className = "", ...props }: Props) => {
  return (
    <button
      className={`flex items-center gap-2 bg-white rounded-outer px-6 py-5 cursor-pointer border-none ${className}`}
      style={{ color }}
      {...props}
    >
      {Icon && <Icon size={20} color={color} />}
      <span className="text-sm leading-tight">{text}</span>
    </button>
  );
};

export default ButtonMain;
