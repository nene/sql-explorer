import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { parse, Program } from "sql-parser-cst";

const parseSql = (sql: string) =>
  parse(sql, { dialect: "sqlite", includeRange: true });

const initialSql = " SELECT * FROM my_tbl";

export type AppState = {
  sql: string;
  cst: Program;
  error: string;
  highlight: [number, number];
  cursor: number;
};

const initialState: AppState = {
  sql: initialSql,
  cst: parseSql(initialSql),
  error: "",
  highlight: [0, 0],
  cursor: 0,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSql: (state, action: PayloadAction<string>) => {
      const sql = action.payload;
      try {
        return { ...state, sql, cst: parseSql(sql), error: "" };
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
      return { ...state, cursor: action.payload };
    },
  },
});

export const { setSql, highlightRange, removeHighlight, setCursor } =
  appSlice.actions;

export default appSlice.reducer;

export const selectHighlight = (state: AppState) => state.highlight;
export const selectCursor = (state: AppState) => state.cursor;
export const selectSql = (state: AppState) => state.sql;
export const selectCst = (state: AppState) => state.cst;
export const selectError = (state: AppState) => state.error;
