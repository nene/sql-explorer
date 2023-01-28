import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";

const EditorBorder = styled.div`
  border: 2px solid #ddd;
`;

const extensions = [sql()];

export function TextEditor({
  value,
  onChange,
  onCursorPositionChange,
}: {
  value: string;
  onChange: (s: string) => void;
  onCursorPositionChange: (index: number) => void;
}) {
  return (
    <EditorBorder>
      <CodeMirror
        value={value}
        height="200px"
        extensions={extensions}
        onChange={onChange}
        onUpdate={(update) => {
          const range = update.state.selection.ranges[0];
          onCursorPositionChange(range.from);
        }}
      />
    </EditorBorder>
  );
}
