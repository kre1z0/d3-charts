import React from "react";

import pattern from "./pattern.png";
import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const PercentBarChart = (props) => {
  const { width, height } = props;
  const [ref] = useDraw(props);
  return <Container ref={ref} width={width} height={height} />;
};

PercentBarChart.defaultProps = {
  width: 1200,
  data: {},
  colors: [
    "#1FB3AA",
    pattern,
    "#0090CE",
    "#4E76C7",
    "#8757A8",
    "#A23375",
    "#C33D55",
    "#BF8733",
    "#B2BB48",
    "#7BB039",
    "#F4F7F9",
  ],
  labels: [],
};
