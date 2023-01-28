import React, { useState } from "react";
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
`;

const cst = {
  type: "select_stmt",
  clauses: [
    { type: "select_clause", columns: [{ type: "all_columns" }] },
    { type: "from_clause", expr: { type: "identifier", name: "my_table" } },
  ],
};

export function App() {
  const [sql, setSql] = useState("SELECT * FROM my_tbl");
  return (
    <Content>
      <TitleBar>
        <Title>SQL Explorer</Title>
      </TitleBar>
      <TreeArea>
        <Tree data={cst} />
      </TreeArea>
      <TextEditor value={sql} onChange={setSql} />
    </Content>
  );
}
