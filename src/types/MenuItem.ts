import type { SvgIconTypeMap } from "@mui/material/SvgIcon";
import type { OverridableComponent } from "@mui/types";

export type MenuItem = {
  header: string;
  link?: string;
  id?: number;
  isLast?: boolean;
  Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
};
