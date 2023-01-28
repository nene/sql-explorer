import React, { useState } from "react";
import styled from "styled-components";

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

function PlainPropertyNode({ name, value }: { name?: string; value: any }) {
  return (
    <TreeNode>
      {name ? <PropertyName>{name}</PropertyName> : null}
      {name ? <GraySpan>{": "}</GraySpan> : null}
      <Value>{JSON.stringify(value)}</Value>
    </TreeNode>
  );
}

function ObjectPropertyNode({ name, value }: { name?: string; value: object }) {
  const [expanded, setExpanded] = useState(true);
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
      <NodeType onClick={() => setExpanded(!expanded)}>
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

function ArrayPropertyNode({ name, value }: { name?: string; value: any[] }) {
  const [expanded, setExpanded] = useState(true);
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

function PropertyNode(props: { name?: string; value: any }) {
  if (props.value instanceof Array) {
    return <ArrayPropertyNode {...props} />;
  } else if (typeof props.value === "object" && props.value !== null) {
    return <ObjectPropertyNode {...props} />;
  } else {
    return <PlainPropertyNode {...props} />;
  }
}

function PropertyList({ value }: { value: object }) {
  return (
    <NodeList>
      {Object.entries(value).map(([name, value]) => (
        <PropertyNode name={name} value={value} key={name} />
      ))}
    </NodeList>
  );
}

function ArrayElementList({ value }: { value: any[] }) {
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

export function Tree({ data }: { data: object }) {
  return <ObjectPropertyNode value={data} />;
}
