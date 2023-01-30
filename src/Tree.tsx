import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Node, Program } from "sql-parser-cst";
import { highlightRange, removeHighlight } from "./state/appSlice";
import { selectCursor } from "./state/appSlice";
import {
  ExpandablePropertyName,
  GrayDiv,
  GraySpan,
  NodeList,
  NodeType,
  PropertyName,
  TreeNode,
  Value,
} from "./TreeStyles";
import { getRange, isCursorInside, isNode, toCamelCase } from "./util";

function typeName(obj: object): string {
  if ("type" in obj) {
    return toCamelCase(obj.type as string);
  } else {
    return "";
  }
}

function showValue(value: any): string {
  return value === undefined ? "undefined" : JSON.stringify(value);
}

function isPropertyVisible(name: string, value: any): boolean {
  return value !== undefined;
}

function PlainPropertyNode({ name, value }: { name?: string; value: any }) {
  return (
    <TreeNode>
      {name ? <PropertyName>{name}</PropertyName> : null}
      {name ? <GraySpan>{": "}</GraySpan> : null}
      <Value>{showValue(value)}</Value>
    </TreeNode>
  );
}

function ObjectPropertyNode({
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

function ArrayPropertyNode({
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

type Literal = string | number | boolean | null | undefined;

function PropertyNode({
  name,
  value,
}: {
  name?: string;
  value: Node | Node[] | Literal;
}) {
  if (value instanceof Array) {
    return <ArrayPropertyNode name={name} value={value} />;
  } else if (typeof value === "object" && value !== null) {
    return <ObjectPropertyNode name={name} value={value} />;
  } else {
    return <PlainPropertyNode name={name} value={value} />;
  }
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

export function Tree({ data }: { data: Program }) {
  return (
    <NodeList>
      <ObjectPropertyNode value={data} expanded={true} />
    </NodeList>
  );
}
