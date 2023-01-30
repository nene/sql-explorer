import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AppState = {
  highlight: [number, number];
  cursor: number;
};

const initialState: AppState = {
  highlight: [0, 0],
  cursor: 0,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
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

export const { highlightRange, removeHighlight, setCursor } = appSlice.actions;

export default appSlice.reducer;

export const selectHighlight = (state: AppState) => state.highlight;
export const selectCursor = (state: AppState) => state.cursor;
