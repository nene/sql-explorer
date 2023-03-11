import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Node } from "sql-parser-cst";
import {
  AppState,
  highlightRange,
  removeHighlight,
  selectIsExpanded,
  selectIsHighlighted,
  selectShowRange,
  toggleNode,
} from "../state/appSlice";
import {
  ExpandablePropertyName,
  GrayDiv,
  GraySpan,
  NodeList,
  NodeType,
  TreeNode,
} from "./TreeStyles";
import { getRange, isNode, toCamelCase } from "../util";
import { PropertyNode } from "./PropertyNode";

export function ObjectPropertyNode({
  name,
  value,
}: {
  name?: string;
  value: Node;
  expanded?: boolean;
}) {
  const expanded = useSelector((state: AppState) =>
    selectIsExpanded(state, value)
  );
  const highlighted = useSelector((state: AppState) =>
    selectIsHighlighted(state, value)
  );
  const dispatch = useDispatch();
  const toggle = useCallback(() => {
    dispatch(toggleNode(value));
  }, [dispatch, value]);

  return (
    <TreeNode expandable expanded={expanded} highlighted={highlighted}>
      {name ? (
        <>
          <ExpandablePropertyName onClick={toggle}>
            {name}
          </ExpandablePropertyName>
          <GraySpan>{": "}</GraySpan>
        </>
      ) : null}
      <NodeType
        onClick={toggle}
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
  const showRange = useSelector(selectShowRange);
  return (
    <NodeList>
      {Object.entries(value)
        .filter(([k, v]) => isPropertyVisible(k, v, showRange))
        .map(([name, value]) => (
          <PropertyNode name={name} value={value} key={name} />
        ))}
    </NodeList>
  );
}

function isPropertyVisible(
  name: string,
  value: any,
  showRange: boolean
): boolean {
  return value !== undefined && (name === "range" ? showRange : true);
}

function typeName(obj: any): string {
  return isNode(obj) ? toCamelCase(obj.type) : "";
}
