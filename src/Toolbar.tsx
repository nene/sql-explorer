import styled from "styled-components";
import { MenuButton } from "./MenuButton";
import { version } from "sql-parser-cst/package.json";

const Title = styled.h1`
  font-size: 18px;
  margin: 0;
  font-family: monospace;
  font-weight: bold;
  padding: 0 10px;
  border-right: 1px solid #dddddd;
`;

const ToolbarArea = styled.div`
  background: #efefef;
  color: #454545;
  line-height: 32px;
  border-bottom: 1px solid #dddddd;
  display: flex;
`;

const GithubLink = styled.div`
  flex: 1;
  text-align: right;
  padding: 0 10px;
`;

export function Toolbar() {
  return (
    <ToolbarArea>
      <Title>SQL Explorer</Title>
      <MenuButton />
      <GithubLink>
        <a href="https://github.com/nene/sql-parser-cst">
          GitHub: SQL Parser CST {version}
        </a>
      </GithubLink>
    </ToolbarArea>
  );
}
