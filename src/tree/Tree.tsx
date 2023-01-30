import { Program } from "sql-parser-cst";
import { NodeList } from "./TreeStyles";
import { ObjectPropertyNode } from "./ObjectPropertyNode";

export function Tree({ data }: { data: Program }) {
  return (
    <NodeList>
      <ObjectPropertyNode value={data} expanded={true} />
    </NodeList>
  );
}
