import React, { useEffect } from "react";

import { onResize } from "./handlers";
import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const DynamicLineChart = (props) => {
  const { height, margin } = props;
  const [ref, redords] = useDraw(props);

  useEffect(() => {
    const args = { height, margin, ...redords };

    if (redords.node) {
      window.addEventListener("resize", () => onResize(args));
    }

    return () => window.removeEventListener("resize", () => onResize(args));
  }, [redords.node]);

  return <Container ref={ref} height={height} />;
};

export const dimensions = ["months", "days"];

DynamicLineChart.defaultProps = {
  height: 250,
  data: [],
  colors: ["rgba(85, 103, 116, 1)"],
  prefix: "₽",
  margin: { bottom: 20, top: 20, left: 20, right: 44 },
  /** months, days **/
  dimension: "months",
};
