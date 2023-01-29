import { useEffect, useState } from "react";
import { parse } from "sql-parser-cst";
import styled from "styled-components";
import { TextEditor } from "./TextEditor";
import { Toolbar } from "./Toolbar";
import { Tree } from "./Tree";

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

  useEffect(() => {
    try {
      setCst(parseSql(sql));
      setError("");
    } catch (e) {
      setError((e as any).message);
    }
  }, [sql, setCst, setError]);

  return (
    <Content>
      <Toolbar />
      <TreeArea>{error ? <pre>{error}</pre> : <Tree data={cst} />}</TreeArea>
      <TextEditor value={sql} onChange={setSql} />
    </Content>
  );
}
