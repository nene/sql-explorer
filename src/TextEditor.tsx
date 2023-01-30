import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCursor, setSql } from "./state/appSlice";
import { highlightEditorRange } from "./highlightEditorRange";
import { EditorView } from "@codemirror/view";
import { selectHighlight } from "./state/appSlice";

const EditorBorder = styled.div`
  border: 2px solid #ddd;
`;

const extensions = [sql()];

export function TextEditor({ value }: { value: string }) {
  const dispatch = useDispatch();
  const highlight = useSelector(selectHighlight);
  const [editorView, setEditorView] = useState<EditorView | undefined>(
    undefined
  );

  const onSqlChange = useCallback(
    (sql: string) => dispatch(setSql(sql)),
    [dispatch]
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
      highlightEditorRange(editorView, highlight);
    }
  }, [editorView, highlight]);

  return (
    <EditorBorder>
      <CodeMirror
        value={value}
        height="200px"
        extensions={extensions}
        onChange={onSqlChange}
        onUpdate={onUpdate}
        onCreateEditor={setEditorView}
      />
    </EditorBorder>
  );
}
