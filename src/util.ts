import { Node } from "sql-parser-cst";

export const isObject = (value: any): value is Object =>
  typeof value === "object" && !Array.isArray(value) && value !== null;

export const isString = (value: any): value is string =>
  typeof value === "string";

export const isNode = (value: any): value is Node =>
  isObject(value) && isString(value.type);

export const getRange = (node: Node): [number, number] => node.range ?? [0, 0];

export const isCursorInside = (cursor: number, node: Node) => {
  const range = getRange(node);
  return range[0] <= cursor && cursor <= range[1];
};

export function toCamelCase(str: string): string {
  return str
    .replace(/_(.)/g, (s, s1) => s1.toUpperCase())
    .replace(/^(.)/, (s, s1) => s1.toUpperCase());
}
