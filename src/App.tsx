import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectCst, selectError, selectSql, setSql } from "./state/appSlice";
import { TextEditor } from "./TextEditor";
import { Toolbar } from "./Toolbar";
import { Tree } from "./tree/Tree";

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
  const sql = useSelector(selectSql);
  const cst = useSelector(selectCst);
  const error = useSelector(selectError);

  return (
    <Content>
      <Toolbar />
      <TreeArea>{error ? <pre>{error}</pre> : <Tree data={cst} />}</TreeArea>
      <TextEditor value={sql} />
    </Content>
  );
}
