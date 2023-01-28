import React, { useEffect, useState } from "react";
import { parse } from "sql-parser-cst";
import styled from "styled-components";
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

export function App() {
  const [sql, setSql] = useState("SELECT * FROM my_tbl");
  const [cst, setCst] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setCst(parse(sql, { dialect: "sqlite" }));
      setError("");
    } catch (e) {
      setError((e as any).message);
    }
  }, [sql, setCst, setError]);

  return (
    <Content>
      <TitleBar>
        <Title>SQL Explorer</Title>
      </TitleBar>
      <TreeArea>{error ? <pre>{error}</pre> : <Tree data={cst} />}</TreeArea>
      <TextEditor value={sql} onChange={setSql} />
    </Content>
  );
}
