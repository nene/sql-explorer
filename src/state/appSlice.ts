import { createSlice, original } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DialectName, Node, parse, Program } from "sql-parser-cst";
import { nodesAtPosition } from "./nodesAtPosition";
import { last } from "../util";

const parseSql = (sql: string) =>
  parse(sql, { dialect: "sqlite", includeRange: true });

const initialSql = " SELECT * FROM my_tbl";

type Dialect = { id: DialectName; name: string; active?: boolean };

export type AppState = {
  sql: string;
  cst: Program;
  error: string;
  highlight: [number, number];
  cursor: number;
  expandedNodes: any[];
  highlightedNode?: any;
  dialects: Dialect[];
};

const initialState: AppState = {
  sql: initialSql,
  cst: parseSql(initialSql),
  error: "",
  highlight: [0, 0],
  cursor: 0,
  expandedNodes: [],
  highlightedNode: undefined,
  dialects: [
    { id: "sqlite", name: "SQLite", active: true },
    { id: "bigquery", name: "BigQuery" },
    { id: "mysql", name: "MySQL" },
  ],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSql: (state, action: PayloadAction<string>) => {
      const sql = action.payload;
      try {
        const cst = parseSql(sql);
        return { ...state, sql, cst, error: "", expandedNodes: [cst] };
      } catch (e) {
        return { ...state, sql, error: (e as any).message };
      }
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
      return { ...state, dialects };
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
