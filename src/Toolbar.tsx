import styled from "styled-components";

const Title = styled.h1`
  font-size: 18px;
  margin: 0;
  font-family: monospace;
  font-weight: bold;
`;

const ToolbarArea = styled.div`
  background: #efefef;
  color: #454545;
  line-height: 32px;
  padding: 0 10px;
  border-bottom: 1px solid #dddddd;
`;

export function Toolbar() {
  return (
    <ToolbarArea>
      <Title>SQL Explorer</Title>
    </ToolbarArea>
  );
}
