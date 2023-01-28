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

export function Tree() {
  return (
    <NodeList>
      <TreeNode expandable expanded>
        <NodeName>Root</NodeName>
        <GraySpan>{": "}</GraySpan>
        <GraySpan>{" {"}</GraySpan>
        <NodeList>
          <TreeNode>
            <PropertyName>sourceType</PropertyName>
            <GraySpan>{": "}</GraySpan>
            <Value>"module"</Value>
          </TreeNode>
          <TreeNode>
            <PropertyName>interpreter</PropertyName>
            <GraySpan>{": "}</GraySpan>
            <Value>null</Value>
          </TreeNode>
          <TreeNode expandable>
            <PropertyName>items</PropertyName>
            <GraySpan>{": "}</GraySpan>
            <GraySpan>{" [ ]"}</GraySpan>
          </TreeNode>
        </NodeList>
        <GrayDiv>{"}"}</GrayDiv>
      </TreeNode>
    </NodeList>
  );
}
