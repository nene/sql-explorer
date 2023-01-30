import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Node } from "sql-parser-cst";
import { selectCursor } from "../state/appSlice";
import {
  ExpandablePropertyName,
  GrayDiv,
  GraySpan,
  NodeList,
  TreeNode,
} from "./TreeStyles";
import { isCursorInside, isNode } from "../util";
import { Literal } from "./Literal";
import { PropertyNode } from "./PropertyNode";

export function ArrayPropertyNode({
  name,
  value,
}: {
  name?: string;
  value: (Node | Literal)[];
}) {
  const [expanded, setExpanded] = useState(false);
  const cursor = useSelector(selectCursor);
  useEffect(() => {
    if (value.some((x) => (isNode(x) ? isCursorInside(cursor, x) : false))) {
      setExpanded(true);
    }
  }, [cursor, value, setExpanded]);

  return (
    <TreeNode expandable expanded={expanded}>
      {name ? (
        <ExpandablePropertyName onClick={() => setExpanded(!expanded)}>
          {name}
        </ExpandablePropertyName>
      ) : null}
      {name ? <GraySpan>{": ["}</GraySpan> : <GraySpan>{"["}</GraySpan>}
      {expanded ? (
        <>
          <ArrayElementList value={value} />
          <GrayDiv>{"]"}</GrayDiv>
        </>
      ) : (
        <GraySpan>{" ]"}</GraySpan>
      )}
    </TreeNode>
  );
}

function ArrayElementList({ value }: { value: (Node | Literal)[] }) {
  if (value.length === 0) {
    return null;
  }
  return (
    <NodeList>
      {value.map((v, i) => (
        <PropertyNode value={v} key={i} />
      ))}
    </NodeList>
  );
}
