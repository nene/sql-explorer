import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type HighlightState = [number, number];

const initialState: HighlightState = [2, 8];

export const highlightSlice = createSlice({
  name: "highlight",
  initialState,
  reducers: {
    highlightRange: (state, action: PayloadAction<[number, number]>) => {
      return action.payload;
    },
    removeHighlight: (state, action: PayloadAction<void>) => {
      return [0, 0];
    },
  },
});

export const { highlightRange, removeHighlight } = highlightSlice.actions;

export default highlightSlice.reducer;

export const selectHighlight = (state: RootState) => state.highlight;
