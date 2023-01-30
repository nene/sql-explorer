import { GraySpan, PropertyName, TreeNode, Value } from "./TreeStyles";

export function PlainPropertyNode({
  name,
  value,
}: {
  name?: string;
  value: any;
}) {
  return (
    <TreeNode>
      {name ? <PropertyName>{name}</PropertyName> : null}
      {name ? <GraySpan>{": "}</GraySpan> : null}
      <Value>{showValue(value)}</Value>
    </TreeNode>
  );
}

function showValue(value: any): string {
  return value === undefined ? "undefined" : JSON.stringify(value);
}
