import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCursor } from "./state/cursorSlice";
import { highlightRange } from "./highlightRange";
import { EditorView } from "@codemirror/view";

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

  const codeMirror = useRef(null);
  const onLoad = useCallback(
    (view: EditorView) => {
      console.log(view);
      highlightRange(view, [12, 19]);
    },
    [codeMirror]
  );

  return (
    <EditorBorder>
      <CodeMirror
        ref={codeMirror}
        value={value}
        height="200px"
        extensions={extensions}
        onChange={onChange}
        onUpdate={onUpdate}
        onCreateEditor={(view) => onLoad(view)}
      />
    </EditorBorder>
  );
}
