import styled from "styled-components";

export const NodeList = styled.ul`
  font-size: 14px;
  font-family: monospace;
  margin: 0;
  padding-left: 20px;
`;

export const TreeNode = styled.li<{
  expanded?: boolean;
  expandable?: boolean;
  highlighted?: boolean;
}>`
  margin: 0;
  list-style: none;
  padding: 5px;
  position: relative;
  background: ${(props) => (props.highlighted ? "#fff00666" : "none")};
  &::before {
    content: ${(props) => (props.expanded ? '"-"' : '"+"')};
    color: ${(props) => (props.expanded ? "red" : "green")};
    display: ${(props) => (props.expandable ? "inline" : "none")};
    position: absolute;
    left: -10px;
  }
`;

export const NodeType = styled.span`
  color: #268bd2;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
export const PropertyName = styled.span`
  color: #b58900;
`;
export const ExpandablePropertyName = styled(PropertyName)`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
export const Value = styled.span`
  color: #2aa198;
`;

export const GraySpan = styled.span`
  color: #93a1a1;
`;
export const GrayDiv = styled.div`
  color: #93a1a1;
`;
