import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectCst, selectError, selectSql, setSql } from "./state/appSlice";
import { TextEditor } from "./TextEditor";
import { Toolbar } from "./Toolbar";
import { Tree } from "./tree/Tree";

const AppWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const TreeArea = styled.div`
  flex: 1;
  overflow-y: scroll;
  height: calc(100vh - 33px);
`;
const EditorArea = styled.div`
  flex: 1;
  overflow-y: scroll;
  height: calc(100vh - 33px);
`;

export function App() {
  const sql = useSelector(selectSql);
  const cst = useSelector(selectCst);
  const error = useSelector(selectError);

  return (
    <AppWrap>
      <Toolbar />
      <Content>
        <EditorArea>
          <TextEditor value={sql} />
        </EditorArea>
        <TreeArea>{error ? <pre>{error}</pre> : <Tree data={cst} />}</TreeArea>
      </Content>
    </AppWrap>
  );
}
