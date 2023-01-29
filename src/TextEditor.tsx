import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setCursor } from "./cursorSlice";

const EditorBorder = styled.div`
  border: 2px solid #ddd;
`;

const extensions = [sql()];

export function TextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  const dispatch = useDispatch();

  const onUpdate = useCallback(
    (update: any) => {
      const range = update.state.selection.ranges[0];
      dispatch(setCursor(range.from));
    },
    [dispatch]
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
