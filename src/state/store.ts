import { configureStore } from "@reduxjs/toolkit";
import cursorReducer from "./cursorSlice";
import highlightReducer from "./highlightSlice";

export const store = configureStore({
  reducer: {
    cursor: cursorReducer,
    highlight: highlightReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
