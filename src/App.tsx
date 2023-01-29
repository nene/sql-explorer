import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parse } from "sql-parser-cst";
import styled from "styled-components";
import { setCursor } from "./cursorSlice";
import { RootState } from "./store";
import { TextEditor } from "./TextEditor";
import { Tree } from "./Tree";

const Title = styled.h1`
  font-size: 18px;
  margin: 0;
  font-family: monospace;
  font-weight: bold;
`;

const TitleBar = styled.div`
  background: #efefef;
  color: #454545;
  line-height: 32px;
  padding: 0 10px;
  border-bottom: 1px solid #dddddd;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const TreeArea = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const parseSql = (sql: string) =>
  parse(sql, { dialect: "sqlite", includeRange: true });

const emptyProgram = parseSql("");

export function App() {
  const [sql, setSql] = useState(" SELECT * FROM my_tbl");
  const [cst, setCst] = useState(emptyProgram);
  const [error, setError] = useState("");
  const cursor = useSelector((state: RootState) => state.cursor);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      setCst(parseSql(sql));
      setError("");
    } catch (e) {
      setError((e as any).message);
    }
  }, [sql, setCst, setError]);

  const onCursorPositionChange = useCallback(
    (i: number) => dispatch(setCursor(i)),
    [dispatch]
  );

  return (
    <Content>
      <TitleBar>
        <Title>SQL Explorer</Title>
        <span>{cursor}</span>
      </TitleBar>
      <TreeArea>{error ? <pre>{error}</pre> : <Tree data={cst} />}</TreeArea>
      <TextEditor
        value={sql}
        onChange={setSql}
        onCursorPositionChange={onCursorPositionChange}
      />
    </Content>
  );
}
