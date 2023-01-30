import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Node, Program } from "sql-parser-cst";
import styled from "styled-components";
import { highlightRange, removeHighlight } from "./state/appSlice";
import { selectCursor } from "./state/appSlice";

const NodeList = styled.ul`
  font-size: 14px;
  font-family: monospace;
  margin: 0;
  padding-left: 20px;
`;

const TreeNode = styled.li<{ expanded?: boolean; expandable?: boolean }>`
  margin: 0;
  list-style: none;
  padding: 5px;
  position: relative;
  &::before {
    content: ${(props) => (props.expanded ? '"-"' : '"+"')};
    color: ${(props) => (props.expanded ? "red" : "green")};
    display: ${(props) => (props.expandable ? "inline" : "none")};
    position: absolute;
    left: -10px;
  }
`;

const NodeType = styled.span`
  color: #268bd2;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
const PropertyName = styled.span`
  color: #b58900;
`;
const ExpandablePropertyName = styled(PropertyName)`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
const Value = styled.span`
  color: #2aa198;
`;

const GraySpan = styled.span`
  color: #93a1a1;
`;
const GrayDiv = styled.div`
  color: #93a1a1;
`;

function toCamelCase(str: string): string {
  return str
    .replace(/_(.)/g, (s, s1) => s1.toUpperCase())
    .replace(/^(.)/, (s, s1) => s1.toUpperCase());
}

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

const isObject = (value: any): value is Object =>
  typeof value === "object" && !Array.isArray(value) && value !== null;

const isNode = (value: any): value is Node =>
  isObject(value) && typeof value.type === "string";

const isCursorInside = (cursor: number, node: Node) => {
  const range = getRange(node);
  return range[0] <= cursor && cursor <= range[1];
};

const getRange = (node: Node): [number, number] => node.range ?? [0, 0];

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
  return <ObjectPropertyNode value={data} expanded={true} />;
}
