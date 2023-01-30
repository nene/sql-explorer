import { Node } from "sql-parser-cst";
import { isPositionInside, isNode } from "../util";

export function nodesAtPosition(
  node: Node,
  position: number
): (Node | Node[])[] {
  for (const value of Object.values(node)) {
    if (isNode(value) && isPositionInside(value, position)) {
      return [node, ...nodesAtPosition(value, position)];
    }
    if (Array.isArray(value)) {
      for (const child of value) {
        if (isNode(child) && isPositionInside(child, position)) {
          return [node, value, ...nodesAtPosition(child, position)];
        }
      }
    }
  }
  return [node];
}
