import React from "react";
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

const NodeName = styled.span`
  color: #268bd2;
`;
const PropertyName = styled.span`
  color: #b58900;
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
  return (
    <TreeNode expandable expanded>
      {name ? <PropertyName>{name}</PropertyName> : null}
      {name ? <GraySpan>{": {"}</GraySpan> : <GraySpan>{"{"}</GraySpan>}
      <PropertyList value={value} />
      <GrayDiv>{"}"}</GrayDiv>
    </TreeNode>
  );
}

function ArrayPropertyNode({ name, value }: { name?: string; value: any[] }) {
  return (
    <TreeNode expandable expanded>
      {name ? <PropertyName>{name}</PropertyName> : null}
      {name ? <GraySpan>{": ["}</GraySpan> : <GraySpan>{"["}</GraySpan>}
      <ArrayElementList value={value} />
      <GrayDiv>{"]"}</GrayDiv>
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
