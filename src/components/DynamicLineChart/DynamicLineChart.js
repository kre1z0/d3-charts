import React from "react";

import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const DynamicLineChart = (props) => {
  const { height } = props;
  const [ref] = useDraw(props);

  return <Container ref={ref} height={height} />;
};

DynamicLineChart.defaultProps = {
  height: 250,
  data: [],
  colors: ["#1FB3AA"],
  prefix: "₽",
};
