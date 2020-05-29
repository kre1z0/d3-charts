import React from "react";

import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const DynamicLineChart = (props) => {
  const { width, height } = props;
  const [ref] = useDraw(props);

  return <Container ref={ref} height={height} />;
};

DynamicLineChart.defaultProps = {
  width: window.innerWidth,
  height: 250,
  data: [],
  colors: ["#1FB3AA"],
};
