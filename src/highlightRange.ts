import { EditorView, Decoration, DecorationSet } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";

const addHighlight = StateEffect.define<{ from: number; to: number }>({
  map: ({ from, to }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
  }),
});

const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(highlights, transaction) {
    // ensure highlighted area moves along with text changes
    highlights = highlights.map(transaction.changes);

    // when addHighlight effect occurs in transaction,
    // add the highlight decoration.
    const hlEffect = transaction.effects.find((e) => e.is(addHighlight));
    if (hlEffect) {
      if (hlEffect.value.from === hlEffect.value.to) {
        // Empty mark regions are invalid, instead skip the decoration completely.
        return Decoration.none;
      } else {
        return Decoration.none.update({
          add: [highlightMark.range(hlEffect.value.from, hlEffect.value.to)],
        });
      }
    }
    return highlights;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const highlightMark = Decoration.mark({ class: "cm-highlight" });

const highlightTheme = EditorView.baseTheme({
  ".cm-highlight": { background: "#fff00666" },
});

export function highlightRange(view: EditorView, [from, to]: [number, number]) {
  const effects: StateEffect<any>[] = [addHighlight.of({ from, to })];

  // called for for the first time, initialize the state field and theme
  if (!view.state.field(highlightField, false)) {
    effects.push(StateEffect.appendConfig.of([highlightField, highlightTheme]));
  }
  view.dispatch({ effects });
}
