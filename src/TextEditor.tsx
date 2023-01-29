import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCursor } from "./state/cursorSlice";
import { highlightRange } from "./highlightRange";
import { EditorView } from "@codemirror/view";
import { selectHighlight } from "./state/highlightSlice";

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
  const highlight = useSelector(selectHighlight);
  const [editorView, setEditorView] = useState<EditorView | undefined>(
    undefined
  );

  const onUpdate = useCallback(
    (update: any) => {
      const range = update.state.selection.ranges[0];
      dispatch(setCursor(range.from));
    },
    [dispatch]
  );

  useEffect(() => {
    if (editorView) {
      highlightRange(editorView, highlight);
    }
  }, [editorView, highlight]);

  return (
    <EditorBorder>
      <CodeMirror
        value={value}
        height="200px"
        extensions={extensions}
        onChange={onChange}
        onUpdate={onUpdate}
        onCreateEditor={setEditorView}
      />
    </EditorBorder>
  );
}
