import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIncludes,
  selectShowRange,
  setIncludes,
  setShowRange,
} from "./state/appSlice";

const Wrap = styled.div`
  padding: 0 10px;
`;

const Label = styled.label`
  cursor: pointer;
  margin-left: 10px;
`;

export function FeatureToggles() {
  const dispatch = useDispatch();
  const showRange = useSelector(selectShowRange);
  const { includeComments } = useSelector(selectIncludes);

  return (
    <Wrap>
      Include:
      <Label>
        <input
          type="checkbox"
          checked={showRange}
          onChange={(e) => dispatch(setShowRange(e.target.checked))}
        />
        range
      </Label>
      <Label>
        <input
          type="checkbox"
          checked={includeComments}
          onChange={(e) =>
            dispatch(setIncludes({ includeComments: e.target.checked }))
          }
        />
        comments
      </Label>
    </Wrap>
  );
}
