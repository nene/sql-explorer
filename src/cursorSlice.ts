import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
