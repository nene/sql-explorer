import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type CursorState = number;

const initialState: CursorState = 0;

export const cursorSlice = createSlice({
  name: "cursor",
  initialState,
  reducers: {
    setCursor: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

export const { setCursor } = cursorSlice.actions;

export default cursorSlice.reducer;

export const selectCursor = (state: RootState) => state.cursor;
