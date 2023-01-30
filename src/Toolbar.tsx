import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialectName } from "sql-parser-cst";
import styled from "styled-components";
import {
  selectActiveDialect,
  selectDialects,
  setActiveDialect,
} from "./state/appSlice";

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

const MenuButtonArea = styled.div`
  cursor: pointer;
  padding: 0 10px;
  border-right: 1px solid #dddddd;
  position: relative;
  &:hover {
    background: #0000001a;
  }
`;

const Menu = styled.ul<{ expanded?: boolean }>`
  position: absolute;
  top: 32px;
  left: 0;
  padding: 0;
  margin: 0;
  background: #efefef;
  z-index: 1;
  display: ${(props) => (props.expanded ? "block" : "none")};
`;

const MenuItem = styled.li`
  list-style: none;
  padding: 0 10px;
  &:hover {
    background: #0000001a;
  }
`;

function MenuButton() {
  const [expanded, setExpanded] = useState(false);

  const activeDialect = useSelector(selectActiveDialect);
  const dialects = useSelector(selectDialects);
  const dispatch = useDispatch();

  const activateDialect = useCallback(
    (id: DialectName) => {
      dispatch(setActiveDialect(id));
    },
    [dispatch]
  );

  return (
    <MenuButtonArea
      onMouseOver={() => setExpanded(true)}
      onMouseOut={() => setExpanded(false)}
    >
      DB: {activeDialect.name}
      <Menu expanded={expanded}>
        {dialects.map((dialect) => (
          <MenuItem
            key={dialect.id}
            onClick={() => activateDialect(dialect.id)}
          >
            {dialect.name}
          </MenuItem>
        ))}
      </Menu>
    </MenuButtonArea>
  );
}

export function Toolbar() {
  return (
    <ToolbarArea>
      <Title>SQL Explorer</Title>
      <MenuButton />
    </ToolbarArea>
  );
}
