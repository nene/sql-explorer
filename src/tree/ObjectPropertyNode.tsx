import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Node } from "sql-parser-cst";
import { highlightRange, removeHighlight } from "../state/appSlice";
import { selectCursor } from "../state/appSlice";
import {
  ExpandablePropertyName,
  GrayDiv,
  GraySpan,
  NodeList,
  NodeType,
  TreeNode,
} from "./TreeStyles";
import { getRange, isCursorInside, isNode, toCamelCase } from "../util";
import { PropertyNode } from "./PropertyNode";

export function ObjectPropertyNode({
  name,
  value,
  expanded: startExpanded,
}: {
  name?: string;
  value: Node;
  expanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(startExpanded || false);
  const cursor = useSelector(selectCursor);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isCursorInside(cursor, value)) {
      setExpanded(true);
    }
  }, [cursor, value, setExpanded]);

  return (
    <TreeNode expandable expanded={expanded}>
      {name ? (
        <>
          <ExpandablePropertyName onClick={() => setExpanded(!expanded)}>
            {name}
          </ExpandablePropertyName>
          <GraySpan>{": "}</GraySpan>
        </>
      ) : null}
      <NodeType
        onClick={() => setExpanded(!expanded)}
        onMouseOver={() => dispatch(highlightRange(getRange(value)))}
        onMouseOut={() => dispatch(removeHighlight())}
      >
        {typeName(value)}
      </NodeType>
      <GraySpan>{" {"}</GraySpan>
      {expanded ? (
        <>
          <PropertyList value={value} />
          <GrayDiv>{"}"}</GrayDiv>
        </>
      ) : (
        <GraySpan>{" }"}</GraySpan>
      )}
    </TreeNode>
  );
}

function PropertyList({ value }: { value: Node }) {
  return (
    <NodeList>
      {Object.entries(value)
        .filter(([k, v]) => isPropertyVisible(k, v))
        .map(([name, value]) => (
          <PropertyNode name={name} value={value} key={name} />
        ))}
    </NodeList>
  );
}

function isPropertyVisible(name: string, value: any): boolean {
  return value !== undefined;
}

function typeName(obj: any): string {
  return isNode(obj) ? toCamelCase(obj.type) : "";
}
