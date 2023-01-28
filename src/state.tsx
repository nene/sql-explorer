import { createContext } from "react";

export interface AppState {
  expandedNodes: Object[];
  cursorPosition: number;
}

export type ExpandAction = { type: "expand"; node: object };
export type SetCursorAction = { type: "set_cursor"; position: number };
export type AppAction = ExpandAction | SetCursorAction;

export const initialState: AppState = { expandedNodes: [], cursorPosition: 0 };

export const AppStateContext = createContext(initialState);

export const reducer = (state: AppState, action: AppAction) => {
  if (action.type === "expand") {
    return {
      ...state,
      expandedNodes: [...state.expandedNodes, action.node],
    };
  }
  if (action.type === "set_cursor") {
    return {
      ...state,
      cursorPosition: action.position,
    };
  }
  return state;
};

export const CursorContext = createContext(0);
