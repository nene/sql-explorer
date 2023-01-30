import { Node } from "sql-parser-cst";
import { ArrayPropertyNode } from "./ArrayPropertyNode";
import { Literal } from "./Literal";
import { ObjectPropertyNode } from "./ObjectPropertyNode";
import { PlainPropertyNode } from "./PlainPropertyNode";

export function PropertyNode({
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
