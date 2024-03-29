import { createSlice, original } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DialectName, Node, parse, Program } from "sql-parser-cst";
import { nodesAtPosition } from "./nodesAtPosition";
import { last } from "../util";

const parseSql = (sql: string, dialect: DialectName, includes: Includes) =>
  parse(sql, { dialect, includeRange: true, ...includes });

const updateCst = (state: AppState): AppState => {
  try {
    const cst = parseSql(
      state.sql,
      selectActiveDialect(state).id,
      state.includes
    );
    return { ...state, cst, error: "", expandedNodes: [cst] };
  } catch (e) {
    return { ...state, error: (e as any).message };
  }
};

const initialIncludes: Includes = {
  includeComments: true,
  includeNewlines: false,
  includeSpaces: false,
};

const initialSql = `-- example SQL
SELECT
  id, name, address AS addr
FROM
  customer
WHERE
  customer.due_date > NOW()
ORDER BY
  name DESC
`;
const initialCst = parseSql(initialSql, "sqlite", initialIncludes);

type Dialect = { id: DialectName; name: string; active?: boolean };
type Includes = {
  includeComments: boolean;
  includeNewlines: boolean;
  includeSpaces: boolean;
};

export type AppState = {
  sql: string;
  cst: Program;
  error: string;
  highlight: [number, number];
  cursor: number;
  expandedNodes: any[];
  highlightedNode?: any;
  dialects: Dialect[];
  showRange: boolean;
  includes: Includes;
};

const initialState: AppState = {
  sql: initialSql,
  cst: initialCst,
  error: "",
  highlight: [0, 0],
  cursor: 0,
  expandedNodes: [initialCst],
  highlightedNode: undefined,
  dialects: [
    { id: "sqlite", name: "SQLite", active: true },
    { id: "bigquery", name: "BigQuery" },
    { id: "mysql", name: "MySQL" },
    { id: "mariadb", name: "MariaDB" },
    { id: "postgresql", name: "PostgreSQL" },
  ],
  showRange: true,
  includes: initialIncludes,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSql: (state, action: PayloadAction<string>) => {
      return updateCst({ ...state, sql: action.payload });
    },
    highlightRange: (state, action: PayloadAction<[number, number]>) => {
      return { ...state, highlight: action.payload };
    },
    removeHighlight: (state, action: PayloadAction<void>) => {
      return { ...state, highlight: [0, 0] };
    },
    setCursor: (state, action: PayloadAction<number>) => {
      if (state.cursor === action.payload) {
        return state;
      }
      const expanded = nodesAtPosition(
        original(state.cst) as unknown as Node,
        action.payload
      );
      return {
        ...state,
        cursor: action.payload,
        expandedNodes: expanded,
        highlightedNode: last(expanded),
      };
    },
    toggleNode: (immerState, action: PayloadAction<object>) => {
      const state = original(immerState) as unknown as AppState;
      const node = action.payload;
      if (selectIsExpanded(state, node)) {
        return {
          ...state,
          expandedNodes: state.expandedNodes.filter((x) => x !== node),
        };
      } else {
        return {
          ...state,
          expandedNodes: [...state.expandedNodes, node],
        };
      }
    },
    setActiveDialect: (state, action: PayloadAction<DialectName>) => {
      const dialects = state.dialects.map((dialect) => ({
        ...dialect,
        active: dialect.id === action.payload,
      }));
      return updateCst({ ...state, dialects });
    },
    setShowRange: (state, action: PayloadAction<boolean>) => {
      return { ...state, showRange: action.payload };
    },
    setIncludes: (state, action: PayloadAction<Partial<Includes>>) => {
      return updateCst({
        ...state,
        includes: { ...state.includes, ...action.payload },
      });
    },
  },
});

export const {
  setSql,
  highlightRange,
  removeHighlight,
  setCursor,
  toggleNode,
  setActiveDialect,
  setShowRange,
  setIncludes,
} = appSlice.actions;

export default appSlice.reducer;

export const selectHighlight = (state: AppState) => state.highlight;
export const selectCursor = (state: AppState) => state.cursor;
export const selectSql = (state: AppState) => state.sql;
export const selectCst = (state: AppState) => state.cst;
export const selectError = (state: AppState) => state.error;
export const selectIsExpanded = (state: AppState, node: any) =>
  state.expandedNodes.includes(node);
export const selectIsHighlighted = (state: AppState, node: any) =>
  state.highlightedNode === node;
export const selectDialects = (state: AppState) => state.dialects;
export const selectActiveDialect = (state: AppState) =>
  state.dialects.find((d) => d.active) as Dialect;
export const selectShowRange = (state: AppState) => state.showRange;
export const selectIncludes = (state: AppState) => state.includes;
