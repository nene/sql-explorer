import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { useCallback } from "react";

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
  const onUpdate = useCallback(
    (update: any) => {
      const range = update.state.selection.ranges[0];
      onCursorPositionChange(range.from);
    },
    [onCursorPositionChange]
  );

  return (
    <EditorBorder>
      <CodeMirror
        value={value}
        height="200px"
        extensions={extensions}
        onChange={onChange}
        onUpdate={onUpdate}
      />
    </EditorBorder>
  );
}
