import { useCallback } from "react";

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null) {
        const { height, labels, colors } = props;
        const data = Array.isArray(props.data[0]) ? props.data : [props.data];
        const width = Math.min(props.width, node.getBoundingClientRect().width);
      }
    },
    [props.data],
  );
  return [ref];
}
