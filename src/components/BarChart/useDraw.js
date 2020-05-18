import * as d3 from "d3";
import { useCallback } from "react";

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null) {
      }
    },
    [props],
  );
  return [ref];
}
