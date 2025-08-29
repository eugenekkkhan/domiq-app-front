import MDEditor, { getCommands } from "@uiw/react-md-editor";
import WrapTextIcon from "@mui/icons-material/WrapText";
import type {
  ICommand,
  TextAreaTextApi,
  TextState,
} from "@uiw/react-md-editor";

const insertBrCommand: ICommand = {
  name: "insert-br",
  keyCommand: "insert-br",
  buttonProps: { "aria-label": "Insert <br>" },
  icon: <WrapTextIcon sx={{ fontSize: 12 }} />,
  execute: (state: TextState, api: TextAreaTextApi) => {
    const br = "<br />";
    api.replaceSelection(br);
    const pos = state.selection.start + br.length;
    api.setSelectionRange({ start: pos, end: pos });
  },
};

const CustomMDEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <MDEditor
      value={value}
      commands={[insertBrCommand, ...getCommands()]}
      onChange={(val) => onChange(val ?? "")}
    />
  );
};

export default CustomMDEditor;
